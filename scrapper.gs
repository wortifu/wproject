// fungsi scraping Blog BangHasan
function getBlogBangHasan() {

  // url target yang akan di scraping
  var urlTarget = 'https://www.disnakerja.com/';

  // url kita ambil isinya
  var response = UrlFetchApp.fetch(urlTarget);

  // jika web berhasil di ambil datanya, kodenya 200
  if (response.getResponseCode() === 200) {

    // web diambil text nya aja
    var content = response.getContentText();
    
    // kita load ke variable $ datanya
    // dengan parsingnya Cherio, library ke-2 yang kita pasangkan sebelumnya
    const $ = Cheerio.load(content);
    
    var author = $('page-title').text();
    var hasil = author + "📌 Last update (sumber disnakerja.com) :\n\n";
    
    // ambil semua tulisan terakhir dari blog bangHasan
    // sekaligus kita susun hasilnya
     $('article').each((index, element) => {

        // pembuatan nomor urut
         var nomor = index+1;

        // ambil judulnya saja, kemudian kita rapiin yang kebanyakan spasi
        // tag H2 adalah judul artikel (lihat screenshot di artikel)
        var judul = $(element)
            .find('h2.post-title')
            .text()
            .replace(/\s\s+/g, ' ');

        // ambil link yang ada di dalamnya
        var link = $(element)
            .find('a')
            .attr('href');

        // ambil tanggal posting artikelnya
        var rating = $(element)
            .find('p')
            .text();
    
        // disusun buat ditampilkan
        hasil += nomor+'. 📢 <a href="'+link+'">'+judul.trim()+'</a> -\n '+rating+'...\n\n';
    });

    // masukkan logger buat tahu hasilnya
    Logger.log(hasil);

    return hasil;
  }
}
