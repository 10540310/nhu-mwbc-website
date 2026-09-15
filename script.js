console.log(
    "南華中智佛學社網站啟動成功"
);


/* ========================================
   活動圖片資料
======================================== */

async function loadPhotoData(){

    console.log(
        "開始載入活動圖片資料..."
    );

    try{

        const response =
            await fetch(
                "assets/photos.json?v=" +
                Date.now()
            );

        if(!response.ok){

            throw new Error(
                "HTTP " +
                response.status
            );

        }

        const data =
            await response.json();

        const featured =
            Array.isArray(
                data.featured
            )
            ?
            data.featured
            :
            [];

        const gallery =
            Array.isArray(
                data.gallery
            )
            ?
            data.gallery
            :
            [];

        renderFeaturedPhotos(
            featured
        );

        renderGalleryPhotos(
            gallery
        );

        console.log(
            "✅ 活動圖片資料載入完成"
        );

    }
    catch(error){

        console.error(
            "❌ 活動圖片資料載入失敗：",
            error
        );

        /*
            JSON 載入失敗時，
            保留 index.html 原本的
            slide1～slide4 輪播。
        */

        initializeSlider();

        const gallery =
            document.getElementById(
                "activityGallery"
            );

        if(gallery){

            gallery.innerHTML =
            `
            <p>
                活動照片載入失敗
            </p>
            `;

        }

    }

}


/* ========================================
   顯示活動精選
======================================== */

function renderFeaturedPhotos(photos){

    const slider =
        document.querySelector(
            ".slider"
        );

    if(!slider){

        return;

    }

    /*
        保留左右切換按鈕。
    */

    const prevBtn =
        slider.querySelector(
            ".prev"
        );

    const nextBtn =
        slider.querySelector(
            ".next"
        );


    /*
        移除原本 HTML 裡的 slide，
        再依 photos.json 重新建立。
    */

    slider
        .querySelectorAll(
            ".slide"
        )
        .forEach(
            slide => {

                slide.remove();

            }
        );


    const validPhotos =
        photos.filter(
            photo => {

                return (
                    typeof photo === "string" &&
                    photo.trim() !== ""
                );

            }
        );


    if(validPhotos.length === 0){

        /*
            沒有活動精選時，
            隱藏左右按鈕。
        */

        if(prevBtn){

            prevBtn.style.display =
                "none";

        }

        if(nextBtn){

            nextBtn.style.display =
                "none";

        }

        return;

    }


    validPhotos.forEach(
        (photo,index) => {

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                "assets/" +
                photo.trim();

            image.className =
                index === 0
                ?
                "slide active"
                :
                "slide";

            image.alt =
                "活動精選" +
                (index + 1);


            /*
                圖片要放在左右按鈕前面。
            */

            if(prevBtn){

                slider.insertBefore(
                    image,
                    prevBtn
                );

            }
            else{

                slider.appendChild(
                    image
                );

            }

        }
    );


    initializeSlider();

}


/* ========================================
   活動精選輪播
======================================== */

let sliderTimer = null;


function initializeSlider(){

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const nextBtn =
        document.querySelector(
            ".next"
        );

    const prevBtn =
        document.querySelector(
            ".prev"
        );

    let currentSlide =
        0;


    if(sliderTimer){

        clearInterval(
            sliderTimer
        );

        sliderTimer =
            null;

    }


    if(slides.length === 0){

        if(prevBtn){

            prevBtn.style.display =
                "none";

        }

        if(nextBtn){

            nextBtn.style.display =
                "none";

        }

        return;

    }


    if(prevBtn){

        prevBtn.style.display =
            "";

    }

    if(nextBtn){

        nextBtn.style.display =
            "";

    }


    function showSlide(index){

        slides.forEach(
            slide => {

                slide.classList.remove(
                    "active"
                );

            }
        );


        slides[index].classList.add(
            "active"
        );

    }


    function nextSlide(){

        currentSlide++;

        if(
            currentSlide >=
            slides.length
        ){

            currentSlide =
                0;

        }

        showSlide(
            currentSlide
        );

    }


    function prevSlide(){

        currentSlide--;

        if(currentSlide < 0){

            currentSlide =
                slides.length - 1;

        }

        showSlide(
            currentSlide
        );

    }


    /*
        用 onclick，
        避免重新初始化時重複綁定事件。
    */

    if(nextBtn){

        nextBtn.onclick =
            nextSlide;

    }


    if(prevBtn){

        prevBtn.onclick =
            prevSlide;

    }


    showSlide(
        0
    );


    if(slides.length > 1){

        sliderTimer =
            setInterval(
                nextSlide,
                5000
            );

    }

}


/* ========================================
   顯示活動照片
======================================== */

function renderGalleryPhotos(photos){

    const gallery =
        document.getElementById(
            "activityGallery"
        );

    if(!gallery){

        return;

    }


    gallery.innerHTML =
        "";


    const validPhotos =
        photos.filter(
            photo => {

                return (
                    typeof photo === "string" &&
                    photo.trim() !== ""
                );

            }
        );


    if(validPhotos.length === 0){

        gallery.innerHTML =
        `
        <p>
            目前尚無活動照片
        </p>
        `;

        return;

    }


    validPhotos.forEach(
        (photo,index) => {

            const fileName =
                photo.trim();


            const imagePath =
                "assets/" +
                fileName;


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                imagePath;


            link.setAttribute(
                "data-lightbox",
                "gallery"
            );


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                imagePath;


            image.alt =
                "活動照片" +
                (index + 1);


            link.appendChild(
                image
            );


            gallery.appendChild(
                link
            );

        }
    );

}


/* ========================================
   Firestore 最新消息
======================================== */

const firestoreURL =
    "https://firestore.googleapis.com/v1/projects/nhumwbc/databases/default/documents/news/news";


async function loadNews(){

    console.log(
        "開始載入最新消息..."
    );


    try{

        const response =
            await fetch(
                firestoreURL
            );


        if(response.status === 404){

            console.log(
                "目前沒有最新消息資料"
            );

            return;

        }


        if(response.status === 403){

            console.error(
                "Firestore 拒絕讀取最新消息"
            );

            return;

        }


        if(!response.ok){

            const errorText =
                await response.text();


            throw new Error(
                response.status +
                " " +
                errorText
            );

        }


        const documentData =
            await response.json();


        const fields =
            documentData.fields || {};


        function getString(name){

            return (
                fields[name]?.stringValue
                ||
                ""
            );

        }


        /* ================================
           課程表標題
        ================================ */

        const courseTableTitleDisplay =
            document.getElementById(
                "courseTableTitleDisplay"
            );


        const courseTableTitle =
            getString(
                "courseTableTitle"
            );


        if(courseTableTitleDisplay){

            courseTableTitleDisplay.textContent =
                courseTableTitle
                ||
                "本學期課程表";

        }


        /* ================================
           歡迎公告
        ================================ */

        const welcomeContent =
            document.getElementById(
                "welcomeContent"
            );


        if(welcomeContent){

            const content =
                getString(
                    "welcomeContent"
                );


            if(content){

                welcomeContent.textContent =
                    content;

            }

        }


        /* ================================
           日期
        ================================ */

        const welcomeDates =
            document.getElementById(
                "welcomeDates"
            );


        if(welcomeDates){

            const pretest =
                getString(
                    "pretest"
                );

            const posttest =
                getString(
                    "posttest"
                );

            const club =
                getString(
                    "club"
                );


            const dates = [];


            if(pretest){

                dates.push(
                    "前測：" +
                    pretest
                );

            }


            if(posttest){

                dates.push(
                    "後測：" +
                    posttest
                );

            }


            if(club){

                dates.push(
                    "選社：" +
                    club
                );

            }


            if(dates.length > 0){

                welcomeDates.innerHTML =
                    dates.join(
                        "<br>"
                    );

            }
            else{

                welcomeDates.style.display =
                    "none";

            }

        }


        /* ================================
           社課資訊
        ================================ */

        const courseTitle =
            document.getElementById(
                "courseTitle"
            );


        const title =
            getString(
                "courseTitle"
            );


        if(
            courseTitle &&
            title
        ){

            courseTitle.textContent =
                title;

        }


        const courseTopic =
            document.getElementById(
                "courseTopic"
            );


        const topic =
            getString(
                "courseTopic"
            );


        if(
            courseTopic &&
            topic
        ){

            courseTopic.textContent =
                topic;

        }


        const courseDeadline =
            document.getElementById(
                "courseDeadline"
            );


        const deadline =
            getString(
                "deadline"
            );


        if(courseDeadline){

            if(deadline){

                courseDeadline.textContent =
                    "報名截止：" +
                    deadline;

                courseDeadline.style.display =
                    "";

            }
            else{

                courseDeadline.style.display =
                    "none";

            }

        }


        const courseLink =
            document.getElementById(
                "courseLink"
            );


        const link =
            getString(
                "link"
            );


        if(courseLink){

            if(link){

                courseLink.href =
                    link;

                courseLink.style.display =
                    "inline-block";

            }
            else{

                courseLink.style.display =
                    "none";

            }

        }


        const courseNotice =
            document.getElementById(
                "courseNotice"
            );


        const notice =
            getString(
                "courseNotice"
            );


        if(
            courseNotice &&
            notice
        ){

            courseNotice.textContent =
                notice;

        }


        /* ================================
           活動預告
        ================================ */

        const eventTitle =
            document.getElementById(
                "eventTitle"
            );


        const eventName =
            getString(
                "eventName"
            );


        const eventDate =
            getString(
                "eventDate"
            );


        if(eventTitle){

            if(
                eventDate &&
                eventName
            ){

                eventTitle.textContent =
                    eventDate +
                    " " +
                    eventName;

            }
            else if(eventName){

                eventTitle.textContent =
                    eventName;

            }
            else if(eventDate){

                eventTitle.textContent =
                    eventDate;

            }

        }


        const eventDescription =
            document.getElementById(
                "eventDescription"
            );


        const description =
            getString(
                "eventDescription"
            );


        if(
            eventDescription &&
            description
        ){

            eventDescription.textContent =
                description;

        }


        console.log(
            "✅ 最新消息載入完成"
        );

    }
    catch(error){

        console.error(
            "❌ 最新消息載入失敗：",
            error
        );

    }

}


/* ========================================
   Firebase 共用設定
======================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyDk8-Q0gQEW-g6RYrSJgDeqwMwUEM9Khig",

    authDomain:
        "nhumwbc.firebaseapp.com",

    projectId:
        "nhumwbc",

    storageBucket:
        "nhumwbc.firebasestorage.app",

    messagingSenderId:
        "191508777501",

    appId:
        "1:191508777501:web:af7b9a43542654921954f4",

    measurementId:
        "G-EE2J8CPS0H"

};


async function getFirebaseModules(){

    const firebaseAppModule =
        await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
        );


    const firestoreModule =
        await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
        );


    const {
        initializeApp,
        getApps,
        getApp
    } =
        firebaseAppModule;


    const {
        getFirestore,
        collection,
        getDocs,
        doc,
        getDoc
    } =
        firestoreModule;


    const app =
        getApps().length > 0
        ?
        getApp()
        :
        initializeApp(
            firebaseConfig
        );


    const db =
        getFirestore(
            app,
            "default"
        );


    return {

        db,
        collection,
        getDocs,
        doc,
        getDoc

    };

}


/* ========================================
   Firestore 網站設定
======================================== */

async function loadSettings(){

    console.log(
        "開始載入網站設定..."
    );


    try{

        const {
            db,
            doc,
            getDoc
        } =
            await getFirebaseModules();


        const snapshot =
            await getDoc(
                doc(
                    db,
                    "settings",
                    "site"
                )
            );


        if(!snapshot.exists()){

            console.log(
                "目前尚未建立網站設定"
            );

            return;

        }


        const data =
            snapshot.data();


        const heroSubtitle =
            document.getElementById(
                "heroSubtitle"
            );


        if(
            heroSubtitle &&
            data.heroSubtitle
        ){

            heroSubtitle.textContent =
                data.heroSubtitle;

        }


        const heroDescription =
            document.getElementById(
                "heroDescription"
            );


        if(
            heroDescription &&
            data.heroDescription
        ){

            heroDescription.textContent =
                data.heroDescription;

        }


        const clubTimeDisplay =
            document.getElementById(
                "clubTimeDisplay"
            );


        if(
            clubTimeDisplay &&
            data.clubTime
        ){

            clubTimeDisplay.textContent =
                "🕧 社課時間：" +
                data.clubTime;

        }


        const clubLocationDisplay =
            document.getElementById(
                "clubLocationDisplay"
            );


        if(
            clubLocationDisplay &&
            data.clubLocation
        ){

            clubLocationDisplay.textContent =
                "📍 社課地點：" +
                data.clubLocation;

        }


        const instagramLink =
            document.getElementById(
                "instagramLink"
            );


        if(
            instagramLink &&
            data.instagram
        ){

            instagramLink.href =
                data.instagram;

        }


        const lineLink =
            document.getElementById(
                "lineLink"
            );


        if(
            lineLink &&
            data.line
        ){

            lineLink.href =
                data.line;

        }


        const emailLink =
            document.getElementById(
                "emailLink"
            );


        if(
            emailLink &&
            data.email
        ){

            emailLink.href =
                "mailto:" +
                data.email;


            emailLink.textContent =
                "📨 Gmail：" +
                data.email;

        }


        console.log(
            "✅ 網站設定載入完成"
        );

    }
    catch(error){

        console.error(
            "❌ 網站設定載入失敗：",
            error
        );

    }

}


/* ========================================
   Firestore 課程表
======================================== */

async function loadCourses(){

    console.log(
        "開始載入課程表..."
    );


    const courseTableBody =
        document.getElementById(
            "courseTableBody"
        );


    if(!courseTableBody){

        return;

    }


    try{

        const {
            db,
            collection,
            getDocs
        } =
            await getFirebaseModules();


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "courses"
                )
            );


        const courses = [];


        snapshot.forEach(
            documentSnapshot => {

                courses.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        courses.sort(
            (a,b) => {

                return (
                    Number(
                        a.order || 0
                    )
                    -
                    Number(
                        b.order || 0
                    )
                );

            }
        );


        renderCourses(
            courses
        );


        console.log(
            "✅ 課程表載入完成"
        );

    }
    catch(error){

        console.error(
            "❌ 課程表載入失敗：",
            error
        );


        courseTableBody.innerHTML =
        `
        <tr>
            <td colspan="2">
                課程資料載入失敗
            </td>
        </tr>
        `;

    }

}


/* ========================================
   顯示課程表
======================================== */

function renderCourses(courses){

    const courseTableBody =
        document.getElementById(
            "courseTableBody"
        );


    if(!courseTableBody){

        return;

    }


    courseTableBody.innerHTML =
        "";


    if(courses.length === 0){

        const row =
            document.createElement(
                "tr"
            );


        const cell =
            document.createElement(
                "td"
            );


        cell.colSpan =
            2;


        cell.textContent =
            "目前尚無課程資料";


        row.appendChild(
            cell
        );


        courseTableBody.appendChild(
            row
        );


        return;

    }


    courses.forEach(
        course => {

            const row =
                document.createElement(
                    "tr"
                );


            const dateCell =
                document.createElement(
                    "td"
                );


            dateCell.textContent =
                course.date || "";


            const nameCell =
                document.createElement(
                    "td"
                );


            nameCell.textContent =
                course.name || "";


            row.appendChild(
                dateCell
            );


            row.appendChild(
                nameCell
            );


            courseTableBody.appendChild(
                row
            );

        }
    );

}


/* ========================================
   Firestore FAQ
======================================== */

async function loadFAQs(){

    console.log(
        "開始載入 FAQ..."
    );


    const faqList =
        document.getElementById(
            "faqList"
        );


    if(!faqList){

        return;

    }


    try{

        const {
            db,
            collection,
            getDocs
        } =
            await getFirebaseModules();


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "faqs"
                )
            );


        const faqs = [];


        snapshot.forEach(
            documentSnapshot => {

                faqs.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        faqs.sort(
            (a,b) => {

                return (
                    Number(
                        a.order || 0
                    )
                    -
                    Number(
                        b.order || 0
                    )
                );

            }
        );


        renderFAQs(
            faqs
        );


        console.log(
            "✅ FAQ 載入完成"
        );

    }
    catch(error){

        console.error(
            "❌ FAQ 載入失敗：",
            error
        );


        faqList.innerHTML =
        `
        <div class="card">
            <p>
                FAQ 資料載入失敗
            </p>
        </div>
        `;

    }

}


/* ========================================
   顯示 FAQ
======================================== */

function renderFAQs(faqs){

    const faqList =
        document.getElementById(
            "faqList"
        );


    if(!faqList){

        return;

    }


    faqList.innerHTML =
        "";


    if(faqs.length === 0){

        faqList.innerHTML =
        `
        <div class="card">
            <p>
                目前尚無常見問題
            </p>
        </div>
        `;

        return;

    }


    faqs.forEach(
        faq => {

            const questionText =
                String(
                    faq.question || ""
                ).trim();


            const answerText =
                String(
                    faq.answer || ""
                ).trim();


            if(!questionText){

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            const question =
                document.createElement(
                    "h3"
                );


            question.textContent =
                "Q：" +
                questionText;


            const answer =
                document.createElement(
                    "p"
                );


            answer.textContent =
                "A：" +
                answerText;


            card.appendChild(
                question
            );


            card.appendChild(
                answer
            );


            faqList.appendChild(
                card
            );

        }
    );

}


/* ========================================
   網頁開啟後載入
======================================== */

loadPhotoData();

loadNews();

loadSettings();

loadCourses();

loadFAQs();
