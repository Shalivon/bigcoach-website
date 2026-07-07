# ביג קואוצ׳ — אתר (Big Coach Website)

אתר תדמית וקונברסיה עצמאי (standalone, לא Webflow) ל**ביג קואוצ׳** — מותג ליווי כושר, תזונה ואימון אישי של גולן בובליל.
פרונטאנד: HTML/CSS/JS יחיד (single-file), RTL עברית מלא, מותאם דסקטופ ומובייל. בק-אנד: Vercel Serverless Function קטנה לטופס הלידים. מתארח ב-Vercel.

---

## מבנה הפרויקט

```
bigcoach-website/
├── site/                      # האתר עצמו — כל מה שעולה לפרודקשן (Root Directory ב-Vercel)
│   ├── index.html             # הדף הראשי (כל ה-CSS/JS בפנים)
│   ├── api/
│   │   └── lead.js            # Vercel Serverless Function — מקבלת את טופס הלידים
│   ├── accessibility.html     # הצהרת נגישות (טיוטה — דורש אישור עו״ד)
│   ├── privacy.html           # מדיניות פרטיות (טיוטה — דורש אישור עו״ד)
│   └── assets/
│       └── img/
│           └── README.md      # רשימת כל התמונות הנדרשות + מידות מדויקות
├── CLAUDE.md                  # הנחיות עבודה ל-Claude Code
├── .gitignore
└── README.md                  # הקובץ הזה
```

> הפרונטאנד (`site/index.html`) הוא vanilla — אין build step, אין dependencies, אין npm. אפשר לפתוח אותו ישירות בדפדפן. הבק-אנד (`site/api/lead.js`) הוא פונקציה קטנה בלי תלויות שרצה רק בפריסה ל-Vercel (או עם `vercel dev` מקומית) — שרת סטטי רגיל (Python/http-server) לא יריץ אותה.

---

## הרצה מקומית

אין צורך בכלום מותקן. שתי אפשרויות:

**הכי פשוט** — לחיצה כפולה על `site/index.html` (נפתח בדפדפן).

**עם שרת מקומי** (מומלץ לבדיקת מובייל אמיתית) — אם יש Python מותקן:

```bash
cd site
python3 -m http.server 8000
```

ואז לפתוח בדפדפן: `http://localhost:8000`

לבדיקת מובייל: פותחים בכרום, F12, לוחצים על אייקון הנייד (Toggle device toolbar / Ctrl+Shift+M), בוחרים iPhone.

שתי האפשרויות האלה מריצות רק את הפרונטאנד הסטטי — טופס הלידים ינסה לשלוח ל-`/api/lead` ויקבל שגיאת רשת (מטופל בשקט בקוד). לבדוק את הבק-אנד מקומית צריך את ה-Vercel CLI (`vercel dev`), או פשוט לבדוק אחרי פריסה.

---

## פריסה ל-Vercel

הריפו מוגדר לפריסה אוטומטית מה-branch `main`.

1. ב-[vercel.com](https://vercel.com) → New Project → לייבא את הריפו `bigcoach-website`.
2. **Root Directory**: לשנות ל-`site` (חשוב! אחרת Vercel יחפש את `index.html` בשורש הריפו ולא ימצא).
3. Framework Preset: **Other** (זה לא Next.js/React — סטטי + Serverless Functions בלבד).
4. Deploy. כל push ל-`main` יפרוס גרסה חדשה אוטומטית.
5. משתני סביבה (Settings → Environment Variables) לחיבור טופס הלידים ל-CRM/גיליון — ראו `site/api/lead.js` ואת "אחסון ובק-אנד" ב-`CLAUDE.md`.

---

## איך מורידים את הריפו (clone)

```bash
git clone https://github.com/<USERNAME>/bigcoach-website.git
cd bigcoach-website
```

(להחליף `<USERNAME>` בשם המשתמש שלך ב-GitHub)

---

## איך מעלים לראשונה ל-GitHub

אם עוד לא יצרת ריפו ב-GitHub:

1. להיכנס ל-github.com → New repository → לתת שם `bigcoach-website` → **בלי** README/gitignore (כי כבר יש כאן) → Create.
2. בטרמינל, בתיקיית הפרויקט:

```bash
git init
git add .
git commit -m "Initial commit — Big Coach website prototype"
git branch -M main
git remote add origin https://github.com/<USERNAME>/bigcoach-website.git
git push -u origin main
```

---

## עבודה שוטפת עם Git

```bash
git add .
git commit -m "תיאור קצר של השינוי"
git push
```

למשוך שינויים אחרונים מהענן:

```bash
git pull
```

---

## עבודה עם Claude Code

הריפו מוכן לעבודה עם [Claude Code](https://docs.claude.com/en/docs/claude-code).

1. להתקין (פעם אחת):
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
2. מתוך תיקיית הפרויקט:
   ```bash
   claude
   ```
3. Claude Code יקרא אוטומטית את `CLAUDE.md` שמכיל את כל הקונבנציות של הפרויקט (צבעים, פונטים, מבנה, חוקי RTL וכו׳).

דוגמאות לבקשות:
- "תתאים את סקשן גולן למובייל"
- "תוסיף סקשן עדויות חדש מתחת ל-method"
- "תחליף את כל ה-placeholder של הטלפון למספר האמיתי"

---

## תמונות

האתר משתמש במערכת placeholder: כל תמונה חסרה מוצגת כמסגרת מקווקוות עם שם הקובץ והמידות. ברגע ששמים את התמונה האמיתית בתיקייה `site/assets/img/` עם השם הנכון — היא מתחלפת אוטומטית.

הרשימה המלאה של כל התמונות הנדרשות (שמות + מידות מדויקות) נמצאת ב-`site/assets/img/README.md`.

---

## מה עוד צריך לפני פרסום (production checklist)

- [ ] להחליף את כל ה-`972XXXXXXXXX` במספר הוואטסאפ האמיתי (חלקם כבר `972526896182`)
- [ ] למלא טלפון, מייל, handles של רשתות חברתיות בפוטר
- [ ] לשים את כל התמונות האמיתיות ב-`site/assets/img/`
- [ ] **אישור עורך דין** למסמכי הנגישות והפרטיות (כרגע טיוטות עם שדות למילוי `[...]`)
- [ ] למלא פרטי רכז נגישות, ח.פ/ע.מ, תאריכים במסמכים המשפטיים
- [ ] לארח את הפונטים (Rubik / Heebo) עצמאית לפרודקשן מחמיר, או להשאיר Google Fonts
- [ ] לחבר CRM אמיתי ל-`/api/lead` (משתנה סביבה `CRM_WEBHOOK_URL` או `GOOGLE_SHEETS_WEBHOOK_URL`)
- [ ] לחבר WhatsApp Business API (Twilio / 360dialog / Wati) לאוטומציות — דורש חשבון עסקי מאומת

---

## טכנולוגיה

- HTML5 / CSS3 / Vanilla JavaScript — אפס תלויות בפרונטאנד
- Vercel Serverless Function (Node, אפס תלויות) לטופס הלידים
- RTL עברית מלא
- Google Fonts: Rubik (כותרות), Heebo (טקסט)
- נגישות: עומד בעקרונות ת״י 5568 / WCAG AA (skip-link, landmarks, focus-visible, reduced-motion)
- responsive: דסקטופ + מובייל (breakpoint 860px)
- אחסון: Vercel, נפרס אוטומטית מ-`main`
