console.log(
    "南華中智佛學社網站啟動成功"
);



/* ========================================
   活動圖片輪播
======================================== */

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

let currentSlide = 0;



function showSlide(index){

    if(slides.length === 0){

        return;

    }

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

    if(slides.length === 0){

        return;

    }

    currentSlide++;

    if(
        currentSlide >=
        slides.length
    ){

        currentSlide = 0;

    }

    showSlide(
        currentSlide
    );

}



function prevSlide(){

    if(slides.length === 0){

        return;

    }

    currentSlide--;

    if(currentSlide < 0){

        currentSlide =
            slides.length - 1;

    }

    showSlide(
        currentSlide
    );

}



if(nextBtn){

    nextBtn.addEventListener(
        "click",
        nextSlide
    );

}



if(prevBtn){

    prevBtn.addEventListener(
        "click",
        prevSlide
    );

}



if(slides.length > 0){

    showSlide(0);

    setInterval(
        nextSlide,
        5000
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



        /*
            讀取：

            settings/site
        */

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "settings",
                    "site"
                )
            );



        /*
            如果後台還沒有建立設定，
            就保留 index.html 原本的文字。
        */

        if(!snapshot.exists()){

            console.log(
                "目前尚未建立網站設定"
            );

            return;

        }



        const data =
            snapshot.data();



        /* ================================
           首頁副標題
        ================================ */

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



        /* ================================
           首頁簡介
        ================================ */

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



        /* ================================
           社課時間
        ================================ */

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



        /* ================================
           社課地點
        ================================ */

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



        /* ================================
           Instagram
        ================================ */

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



        /* ================================
           LINE
        ================================ */

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



        /* ================================
           Email
        ================================ */

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

        /*
            網站設定失敗時，
            不影響其他首頁功能。
        */

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

loadNews();

loadSettings();

loadCourses();

loadFAQs();