// masukkan TOKEN BOT dari BOT Father
const token = 'TOKEN BOT KAMU'

const tg = new telegram.daftar(token)

// masukkan ID kamu, jika belum tau cek di @strukturbot
const adminBot = ID_TELE_KAMU

// jika debug true, akan mengirimkan struktur JSON ke admin bot
const debug = false 

// -- fungsi telegram

// cek informasi bot
function getMe(){
  let me = tg.getMe()
  return Logger.log(me)
}

function setWebhook() {
  var url = "URL HASIL DEPLOY"
  var r = tg.setWebhook(url)
  return Logger.log(r)
}

// cek info hook bot
function getWebhookInfo() {
  let hasil = tg.getWebhookInfo()
  return Logger.log(hasil)
}

// hapus hook
function deleteWebhook() {
  let hasil = tg.deleteWebhook()
  return Logger.log(hasil)
  
}

// -- kalau mau bikin fungsi sendiri, taruh di bawah sini ---



// fungsi untuk membaca OCR
function scanOCR(chatID, photoID) {
  tg.sendMessage(chatID, '✍🏻 Ditunggu yaa...')
  tg.sendChatAction(chatID, 'typing')

  let file = tg.getFileLink(photoID)

  // variable hasil
  let text = 'belum ada'

  try {
    let blob = UrlFetchApp.fetch(file).getBlob()
    let resource = {
      title: blob.getName(),
      mimeType: blob.getContentType()
    }

    let docFile = Drive.Files.insert(resource, blob, { ocr: true })
    let doc = DocumentApp.openById(docFile.id)

    // ekstrak file doc nya untuk mendapatkan text
    text = doc.getBody().getText()

    // hapus file doc tidak kita pakai lagi
    Drive.Files.remove(docFile.id)

  } catch (e) {
    // jika ERROR
    text = 'ERROR: ' + e.message
  }

  Logger.log('chatID: ' + chatID + 'text: ' + text)

  return tg.sendMessage(chatID, text)
}
