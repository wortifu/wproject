// fungsi buat handle hanya menerima pesan berupa POST, kalau GET keluarkan pesan error
function doGet(e) {
  return tg.util.outputText("Hanya data POST yang kita proses yak!");
}

// fungsi buat handle pesan POST
function doPost(e) {
  // data e kita verifikasi
  let update = tg.doPost(e);

  try {
    if (debug) return tg.sendMessage(adminBot, JSON.stringify(update, null, 2))
    prosesPesan(update)
  } catch (e) {
    tg.sendMessage(adminBot, e.message)
  }

}

// fungsi utama untuk memproses segala pesan yang masuk
function prosesPesan(update) {

  if (update.message) {

    // penyederhanaan variable
    var msg = update.message;

    // geoCode
    // syntax !lokasi (teks minimal 3 huruf)
    var pola = /^[\/!](lok|loc|location|lokasi|posisi) ([\w\s,\.]{3,})/i;
    if (cocok = pola.exec(msg.text)) {
      // geo untuk dapatkan lokasi

      // pertama: kita setup ke dalam bahasa Indonesia
      var geocoder = Maps.newGeocoder().setLanguage('id');
      // kedua: kita cari lokasi nya sesuai request
      var response = geocoder.geocode(cocok[2]);

      // periksa hasilnya, jika tidak ketemu keluarkan pesan error
      if (response.status !== 'OK') return tg.sendMsg(msg, "🚫 Lokasi tidak Ketemu.", 'HTML', false, msg.message_id);

      // jika ketemu, ambil aja data pertama

      // penyederhanaan variable untuk geo data pertama
      var Lokasi = response.results[0];

      var address = Lokasi.formatted_address;
      var latitude = Lokasi.geometry.location.lat;
      var longitude = Lokasi.geometry.location.lng;

      // untuk title, saya bingung dikasih apa
      // diisi koordinatnya aja deh      
      var title = latitude + ", " + longitude;

      // kirim Venue, ada di dokumentasi Lib V2
      // tg.sendVenue(chat_id, latitude, longitude, title, address, foursquare_id, foursquare_type, disable_notification, reply_to_message_id, reply_markup)

      return tg.sendVenue(msg.chat.id, latitude, longitude, title, address, false, false, false, msg.message_id)

      // --> akhir cek geoCode
    }

    // cari lokasi berdasarkan koordinat, reverse Geocode
    // syntax: !lokasi lat, long

    var pola = /^[\/!](?:lok|loc|location|lokasi|posisi) (-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/i;
    if (cocok = pola.exec(msg.text)) {
      // geo untuk dapatkan lokasi

      // pertama: kita setup ke dalam bahasa Indonesia
      var geocoder = Maps.newGeocoder().setLanguage('id');
      // kedua: kita cari lokasi nya sesuai request
      var response = geocoder.reverseGeocode(cocok[1], cocok[2]);

      // periksa hasilnya, jika tidak ketemu keluarkan pesan error
      if (response.status !== 'OK') return tg.sendMsg(msg, "🚫 Lokasi koordinat tidak Ketemu.", 'HTML', false, msg.message_id);

      // jika ketemu, ambil aja data pertama

      // penyederhanaan variable untuk geo data pertama
      var Lokasi = response.results[0];

      // untuk title, saya bingung dikasih apa
      // namanya di pantek Lokasi aja deh        
      var title = 'Lokasi';

      var address = Lokasi.formatted_address;
      var latitude = Lokasi.geometry.location.lat;
      var longitude = Lokasi.geometry.location.lng;

      // kirim Venue, ada di dokumentasi Lib V2
      // tg.sendVenue(chat_id, latitude, longitude, title, address, foursquare_id, foursquare_type, disable_notification, reply_to_message_id, reply_markup)

      return tg.sendVenue(msg.chat.id, latitude, longitude, title, address, false, false, false, msg.message_id)

      // --> akhir cek reverse GeoCode
    }

    // deteksi event letakkan di sini
    // deteksi tipe message
    if (msg.location) {
      // penyederhanaan variable
      var location = msg.location;

      // penyusunan teks untuk dikirim
      var teks = `📍 Posisi kamu di koordinat: <code>${location.latitude}, ${location.longitude}</code>.`;
      return tg.sendMsg(msg, teks, 'HTML', false, msg.message_id);
    }
    // jika ada pesan berupa text
    if (msg.text) {

      // jika user klik start, bot akan menjawab
      var pola = /\/start/i
      if (pola.exec(msg.text)) {
        var nama = msg.from.first_name
        if (msg.from.last_name)
          nama += ' ' + msg.from.last_name
        // perhatikan, ini menggunakan sendMsg bukan sendMessage
        var pesan = "🙋🏽 Halo, <b>" + tg.util.clearHTML(nama) + "</b>, Terimakasih telah menggunakan <u>wproject</u>"
        
        pesan += "\n\n ⌐<b>Berikut fitur bot :</b>"
        pesan += "\n\n 📌 <b>Silahkan klik</b> /getloker untuk mendapat info lowongan kerja ter update (disnakerja.com)"
        pesan += "\n\n 🏙 <b>Silahkan kirimkan foto/gambar untuk konversi gambar menjadi text</b>"
        pesan += "\n\n 📍 <b>Silahkan kirimkan Lokasi untuk mendapatkan info lokasi anda</b>"
        pesan += "\n\n 👉 Kirim <code>!lok (nama tempat) </code>untuk mencari lokasi berdasarkan nama tempat"
        pesan += "\n [?] Cth : <code>!lok Simpang lima gumul</code>"
        pesan += "\n\n 👉 Kirim <code>!lok (-lat,long) </code>untuk mencari lokasi berdasarkan koordinat"
        pesan += "\n [?] Cth : <code>!lok -7.559284, 112.204018</code>"

        var keyboard = []

        // keyboard baris pertama
        // index dimulai dari 0
        keyboard[0] = [
          tg.button.url('😷 @wortifu', 'https://t.me/wortifu'),
        ]
        // keyboard baris kedua
        keyboard[1] = [
          tg.button.text('❓ About', 'me_click')
        ]

        return tg.sendMsgKeyboardInline(msg, pesan, keyboard, 'HTML')
      }

      // jika user ketik /ping, bot akan jawab Pong!
      // pola dan jawaban paling sederhana
 
    var pola = /^[\/!]ping$/i
      if (pola.exec(msg.text)) {
        // balas pong dengan mereply pesan
        // menggunakan parse_mode Markdown
        return tg.sendMessage(msg.chat.id, '🏓 *Pooong! bot online*', 'Markdown', false, false, msg.message_id)
      }
      

      // akhir deteksi pesan text
    }

    // deteksi jika ada foto
    if (msg.photo) {
      // taruh codinganmu di sini
      // misal menampilkan foto ID
      tg.sendMsg(msg, 'File ID: ' + msg.photo[0].file_id )

      var photoID = msg.photo[msg.photo.length - 1].file_id
      return scanOCR(msg.chat.id, photoID)
    }

    if (/^[!\/]ocr/i.exec(msg.text)) {
      if (msg.reply_to_message) {
        if (msg.reply_to_message.photo) {
          var photo = msg.reply_to_message.photo
          var photoID = photo[photo.length - 1].file_id
          return scanOCR(msg.chat.id, photoID)
        }
      }
      return true
    }

    // akhir update message
  }

  // deteksi callback
  if (update.callback_query) {
    // proses di halaman berikutnya, biar gak terlalu panjang     
    return prosesCallback(update.callback_query)
  }

  // Scraping Blog BangHasan
    // Trigger: /get atau !get
    if (/[\/!]getloker/i.exec(msg.text) ) {
       var pesan = getBlogBangHasan();
       return tg.kirimPesan(msg.chat.id, pesan, 'HTML', true);
    }

}
