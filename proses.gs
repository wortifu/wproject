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
    var mrep = msg.message_id 

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
      if (response.status !== 'OK') return tg.sendMsg(msg, "🚫 Lokasi tidak Ketemu.", 'HTML', false, mrep);

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

      return tg.sendVenue(msg.chat.id, latitude, longitude, title, address, false, false, false, mrep)

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
      if (response.status !== 'OK') return tg.sendMsg(msg, "🚫 Lokasi koordinat tidak Ketemu.", 'HTML', false, mrep);

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

      return tg.sendVenue(msg.chat.id, latitude, longitude, title, address, false, false, false, mrep)

      // --> akhir cek reverse GeoCode
    }

    // deteksi event letakkan di sini
    // deteksi tipe message
    if (msg.location) {
      // penyederhanaan variable
      var location = msg.location;

      // penyusunan teks untuk dikirim
      var teks = `📍 Posisi kamu di koordinat: <code>${location.latitude}, ${location.longitude}</code>.`;
      return tg.sendMsg(msg, teks, 'HTML', false, mrep);
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
        var 
        pesan = "🙋🏽 Halo, <b>" + tg.util.clearHTML(nama) + ' ( @' + msg.from.username + ' ) ' + "</b>, Terimakasih telah menggunakan <u>wproject</u>"
        
        pesan += "\n\n <b>Berikut fitur bot :</b>"
        pesan += "\n\n📌 <b>kirimkan Nomor WA</b> ( direct WhatsApp message tanpa menyimpan nomor )"
        pesan += "\n\n📌 <b>Kirimkan foto/gambar untuk konversi gambar menjadi text</b>"
        pesan += "\n\n📌 <b>Kirimkan Lokasi untuk mendapatkan info lokasi anda</b>"
        pesan += "\n\n 👉 Kirim <code>!lok (nama tempat) </code>untuk mencari lokasi berdasarkan nama tempat"
        pesan += "\n[?] : <code>!lok Simpang lima gumul</code>"
        pesan += "\n\n 👉 Kirim <code>!lok (-lat,long) </code>untuk mencari lokasi berdasarkan koordinat"
        pesan += "\n[?] : <code>!lok -7.559284, 112.204018</code>"
        pesan += "\n\n\n↘️ <b>klik</b> /other menu lainnya..."

        var keyboard = []

        // keyboard baris pertama
        // index dimulai dari 0
        keyboard[0] = [
          tg.button.url('😷 @wortifu', 'https://t.me/wortifu'),
          tg.button.url('📄 github', 'https://github.com/wortifu/wproject'),
          tg.button.text('❓ About', 'me_click')
        ]
        // keyboard baris kedua
        //keyboard[1] = [
         // tg.button.text('👉 menu lainnya', 'me_other')
        //] 
        
        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + ' Menu > start', 'HTML' )
        return tg.sendMsgKeyboardInline(msg, pesan, keyboard, 'HTML',false,false, mrep)
      }

      // jika user ketik /ping, bot akan jawab Pong!
      // pola dan jawaban paling sederhana
    var pola = /^[\/!]other$/i
      if (pola.exec(msg.text)) {
      var nama = msg.from.first_name
        if (msg.from.last_name)
          nama += ' ' + msg.from.last_name
        // perhatikan, ini menggunakan sendMsg bukan sendMessage
        var 
        pesanother = "🙋🏽 Halo, <b>" + tg.util.clearHTML(nama) + ' ( @' + msg.from.username + ' ) ' + "</b>\nBerikut menu lainnya:"
        pesanother += "\n\n 📌 <b>klik</b> /cekid untuk Cek ID telegram kamu"
        pesanother += "\n 📌 <b>klik</b> /random (generate angka 1-999999)"
        pesanother += "\n 📌 <b>klik</b> /ping cek status bot"
        pesanother += "\n\n\n↘️ Back to /start ..."
       
       var keyboard = []

        // keyboard baris pertama
        // index dimulai dari 0
        keyboard[0] = [
          tg.button.url('😷 @wortifu', 'https://t.me/wortifu'),
          tg.button.text('❓ About', 'me_click')
        ]

        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + ' Menu > other', 'HTML' )
        return tg.sendMsgKeyboardInline(msg, pesanother,keyboard, 'HTML', false, false, mrep)

      }

    var pola = /^[\/!]ping$/i
      if (pola.exec(msg.text)) {
        // balas pong dengan mereply pesan
        // menggunakan parse_mode Markdown
        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + " Menu > ping", 'HTML', false, msg.message_id)
        return tg.sendMessage(msg.chat.id, '🏓 *Pooong! bot online*', 'Markdown', false, false, msg.message_id)
      }
    
    var pola = /^[\/!]cekid$/i
      if (pola.exec(msg.text)) {
      let text ="ID kamu : <code>" + msg.from.id + "</code>\n";
        text +="Username kamu : @" + msg.from.username;
        text +="\nNama kamu : " + msg.from.first_name + " " + msg.from.last_name;


        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + " Menu > cekid", 'HTML' )
        return tg.sendMessage(msg.chat.id, text, 'HTML', false,false, msg.message_id)
      }
      var pola = /^[\/!]random$/i
      if (pola.exec(msg.text)) {
      let text ="> Generated :\n<code>" + tg.util.random(1,999999) + "</code>";
        
        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + " Menu > random", 'HTML' )
        return tg.sendMessage(msg.chat.id, text, 'HTML', false,false, msg.message_id)
      }
      var pola = /^\d+/i
      if (pola.exec(msg.text)) {

        tg.sendMsg(msg, '✍🏻 <b>Got it</b>', 'HTML', false, true)
        tg.sendChatAction(msg.chat.id, 'typing')
        tg.sendMessage(adminBot, 'Data dari <code>' + msg.from.id + '</code> @' + msg.from.username + " Menu > wa.me"+ msg.text, 'HTML' )
      return tg.sendMessage(msg.chat.id, '👉 Generated Link :\n https://wa.me/62'+ msg.text, 'HTML', true,false, msg.message_id)
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

  

}
