# 🔄 Auto-Sync Dashboard RSTIM Papua

Dashboard **SA Antarpoli** dengan auto-sync dari Google Sheets.

## 📊 Status

- **Dashboard**: https://rstimpapua21-cmyk.github.io/sa-antar-ko/sa_ntarko.html
- **Auto-sync**: Setiap 30 menit
- **Actions**: https://github.com/rstimpapua21-cmyk/sa-antar-ko/actions

## 🚀 Fitur

✅ Auto-sync dari Google Sheets setiap 30 menit  
✅ Notifikasi Telegram (optional)  
✅ Real-time data refresh di browser  
✅ Fallback ke cached data jika offline  

## 🛠️ Setup Telegram (Optional)

1. Chat `@BotFather` di Telegram → `/newbot`
2. Catat **Bot Token**
3. Chat bot Anda, kirim `/start`
4. Buka: `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Catat `chat.id`
6. Add ke GitHub Secrets:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

## 📖 Dokumentasi

Lihat file `README_SYNC.md` untuk detail lengkap.

---

**Last Updated:** 10 Juli 2026
