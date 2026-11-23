# صلاح سالم — سباق الأساطير | Salah Salem: Legends Race

لعبة سباق عربيات مصرية ثلاثية الأبعاد بتشتغل في المتصفح مباشرة (Three.js)، بعربيات زي هيونداي فيرنا وتاكسي القاهرة، ونمط سباق وتجربة زمن، وتحكم كيبورد ولمس وإمالة الموبايل.

An Egyptian 3D browser racing game (Three.js) with locally iconic cars, race and time-trial modes, and keyboard, touch and tilt controls.

**اللعبة مباشرة | Play:** https://faresdief.github.io/salah-salem-legends/

## التشغيل محليًا | Run locally

مفيش خطوة بناء. أي سيرفر ملفات ثابتة يكفي:

No build step. Any static file server works:

```bash
python3 -m http.server 8000
# افتح | open http://localhost:8000/
```

## حالة اللعب الأونلاين | Online play status

- تبويب «لوبي تجريبي (محلي)» هو **لوبي محلي تجريبي**: بيشتغل في الذاكرة جوه الصفحة المفتوحة بس، ومش بيربط جهازين مختلفين ببعض.
- الكود فيه دعم جاهز لـ Firebase Realtime Database (`NetworkBridge.initFirebase`)، لكن **مفيش إعداد Firebase متوصّل حاليًا** ولا سكريبت Firebase محمّل في الصفحة، فالوضع الفعلي دايمًا محلي.
- عشان تفعّل الأونلاين الحقيقي: حمّل سكريبتات Firebase في `index.html` وعرّف `window.SS_FIREBASE` بإعدادات مشروعك قبل سكريبت اللعبة. من غير ده اللوبي هيفضل تجريبي محلي.
- نتائج المتصدرين كمان بتتخزن محليًا بس (مش متصدرين عالميين).

The "demo lobby" tab is a **local-only demo**: it runs in memory inside the open page and does not connect two devices. The code ships a Firebase adapter (`NetworkBridge.initFirebase`), but no Firebase config is wired and no Firebase script is loaded, so play is always local. To enable real online play, load the Firebase scripts in `index.html` and define `window.SS_FIREBASE` with your project config. Leaderboard scores are also stored locally only.

## الملفات | Files

- `index.html` — النسخة المبنية الكاملة اللي بتتقدم على GitHub Pages (كل حاجة مضمّنة فيها) | the self-contained built page served on Pages
- `network.js` و `race.js` و `world.js` و `physics.js` و `carbody.js` و `carspecs.js` و `fx.js` و `audio.js` — ملفات المصدر الأصلية قبل الدمج | original source modules
- `build.py` — سكريبت الدمج القديم (بيضمّن CSS/JS جوه HTML) | the old bundling helper

## ملاحظات | Notes

- اللعبة بتستخدم Three.js r128 من CDN (cdnjs).
- كل بيانات اللعب (أفضل لفة، إعدادات) بتتخزن في localStorage على جهازك بس.
