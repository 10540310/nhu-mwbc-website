/* =========================================================
   中智佛學社後台
   最新消息管理程式
========================================================= */


/* =========================================================
   Firebase 模組
========================================================= */

import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



/* =========================================================
   Firebase 設定
========================================================= */

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



/* =========================================================
   Firebase 初始化
========================================================= */

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


/*
    你的 Firestore Database ID 是：

    default

    因此必須明確指定 "default"
*/

const db =
    getFirestore(
        app,
        "default"
    );



/* =========================================================
   DOM 元素
========================================================= */


/* -------------------------
   歡迎公告
------------------------- */

const welcomeContent =
    document.getElementById(
        "welcomeContent"
    );


const pretest =
    document.getElementById(
        "pretest"
    );


const posttest =
    document.getElementById(
        "posttest"
    );


const club =
    document.getElementById(
        "club"
    );



/* -------------------------
   社課資訊
------------------------- */

const courseTitle =
    document.getElementById(
        "courseTitle"
    );


const courseTopic =
    document.getElementById(
        "courseTopic"
    );


const deadline =
    document.getElementById(
        "deadline"
    );


const link =
    document.getElementById(
        "link"
    );


const courseNotice =
    document.getElementById(
        "courseNotice"
    );



/* -------------------------
   活動預告
------------------------- */

const eventDate =
    document.getElementById(
        "eventDate"
    );


const eventName =
    document.getElementById(
        "eventName"
    );


const eventDescription =
    document.getElementById(
        "eventDescription"
    );



/* -------------------------
   操作按鈕 / 顯示區
------------------------- */

const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const newsList =
    document.getElementById(
        "newsList"
    );



/* =========================================================
   管理員登入檢查
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
            如果沒有登入，
            直接送回登入頁。
        */

        if (!user) {

            window.location.replace(
                "admin-login.html"
            );

            return;

        }


        console.log(
            "✅ Firebase 已登入：",
            user.email
        );


        /*
            登入成功後，
            讀取 Firestore 最新消息。
        */

        await loadNews();

    }
);



/* =========================================================
   登出
========================================================= */

window.logout =
    async function () {

        try {

            await signOut(auth);


            window.location.replace(
                "admin-login.html"
            );

        }
        catch (error) {

            console.error(
                "❌ 登出失敗：",
                error
            );


            alert(
                "登出失敗，請稍後再試"
            );

        }

    };



/* =========================================================
   讀取最新消息
========================================================= */

async function loadNews() {

    try {

        console.log(
            "📡 正在讀取最新消息..."
        );


        /*
            Firestore 路徑：

            news
              └─ news
        */

        const newsRef =
            doc(
                db,
                "news",
                "news"
            );


        const snapshot =
            await getDoc(
                newsRef
            );


        /*
            如果 Firestore 還沒有建立 news/news
        */

        if (!snapshot.exists()) {

            console.log(
                "⚠️ Firestore 尚未建立 news/news"
            );


            if (newsList) {

                newsList.innerHTML =
                    `
                    <p class="empty-message">
                        目前尚未建立公告資料
                    </p>
                    `;

            }


            return;

        }


        const data =
            snapshot.data();



        /* =================================================
           歡迎公告
        ================================================= */

        setInputValue(
            welcomeContent,
            data.welcomeContent
        );


        setInputValue(
            pretest,
            data.pretest
        );


        setInputValue(
            posttest,
            data.posttest
        );


        setInputValue(
            club,
            data.club
        );



        /* =================================================
           社課資訊
        ================================================= */

        setInputValue(
            courseTitle,
            data.courseTitle
        );


        setInputValue(
            courseTopic,
            data.courseTopic
        );


        setInputValue(
            deadline,
            data.deadline
        );


        setInputValue(
            link,
            data.link
        );


        setInputValue(
            courseNotice,
            data.courseNotice
        );



        /* =================================================
           活動預告
        ================================================= */

        setInputValue(
            eventDate,
            data.eventDate
        );


        setInputValue(
            eventName,
            data.eventName
        );


        setInputValue(
            eventDescription,
            data.eventDescription
        );



        /* =================================================
           顯示已儲存資料
        ================================================= */

        renderSavedNews(
            data
        );


        console.log(
            "✅ 最新消息讀取成功"
        );

    }
    catch (error) {

        console.error(
            "❌ 最新消息讀取失敗：",
            error
        );


        if (newsList) {

            newsList.innerHTML =
                `
                <p class="empty-message">
                    最新消息載入失敗
                </p>
                `;

        }

    }

}



/* =========================================================
   儲存最新消息
========================================================= */

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async () => {

            /*
                再次確認這是在 news.html。
            */

            if (!welcomeContent) {

                return;

            }


            const confirmed =
                confirm(
                    "確定要儲存目前的最新消息資料嗎？"
                );


            if (!confirmed) {

                return;

            }



            /* -------------------------
               按鈕進入儲存狀態
            ------------------------- */

            const originalButtonText =
                saveBtn.textContent;


            saveBtn.disabled =
                true;


            saveBtn.textContent =
                "儲存中...";



            try {

                const newsRef =
                    doc(
                        db,
                        "news",
                        "news"
                    );



                /*
                    要寫入 Firestore 的資料
                */

                const data = {

                    /* 歡迎公告 */

                    welcomeContent:
                        getInputValue(
                            welcomeContent
                        ),

                    pretest:
                        getInputValue(
                            pretest
                        ),

                    posttest:
                        getInputValue(
                            posttest
                        ),

                    club:
                        getInputValue(
                            club
                        ),


                    /* 社課資訊 */

                    courseTitle:
                        getInputValue(
                            courseTitle
                        ),

                    courseTopic:
                        getInputValue(
                            courseTopic
                        ),

                    deadline:
                        getInputValue(
                            deadline
                        ),

                    link:
                        getInputValue(
                            link
                        ),

                    courseNotice:
                        getInputValue(
                            courseNotice
                        ),


                    /* 活動預告 */

                    eventDate:
                        getInputValue(
                            eventDate
                        ),

                    eventName:
                        getInputValue(
                            eventName
                        ),

                    eventDescription:
                        getInputValue(
                            eventDescription
                        ),


                    /* 更新時間 */

                    updatedAt:
                        serverTimestamp()

                };



                /*
                    merge: true

                    非常重要。

                    Firestore 中如果還有：
                    courseTableTitle
                    或其他欄位，

                    不會因為這次儲存而被刪除。
                */

                await setDoc(
                    newsRef,
                    data,
                    {
                        merge: true
                    }
                );


                alert(
                    "最新消息儲存成功！"
                );


                /*
                    儲存完成後重新讀取，
                    確保畫面和 Firestore 一致。
                */

                await loadNews();

            }
            catch (error) {

                console.error(
                    "❌ 最新消息儲存失敗：",
                    error
                );


                alert(
                    "最新消息儲存失敗"
                );

            }
            finally {

                /*
                    恢復按鈕狀態
                */

                saveBtn.disabled =
                    false;


                saveBtn.textContent =
                    originalButtonText;

            }

        }
    );

}



/* =========================================================
   顯示目前已儲存資料
========================================================= */

function renderSavedNews(data) {

    if (!newsList) {

        return;

    }


    newsList.innerHTML =
        `
        <div class="saved-news-item">

            <h3>
                📢 歡迎公告
            </h3>

            <p>
                ${escapeHtml(
                    data.welcomeContent || ""
                )}
            </p>


            <hr>


            <h3>
                📖 社課資訊
            </h3>

            <p>
                <strong>
                    標題：
                </strong>

                ${escapeHtml(
                    data.courseTitle || ""
                )}
            </p>


            <p>
                <strong>
                    主題：
                </strong>

                ${escapeHtml(
                    data.courseTopic || ""
                )}
            </p>


            <p>
                <strong>
                    截止：
                </strong>

                ${escapeHtml(
                    data.deadline || ""
                )}
            </p>


            <p>
                <strong>
                    補充說明：
                </strong>

                ${escapeHtml(
                    data.courseNotice || ""
                )}
            </p>


            <hr>


            <h3>
                🌸 活動預告
            </h3>

            <p>
                <strong>
                    日期：
                </strong>

                ${escapeHtml(
                    data.eventDate || ""
                )}
            </p>


            <p>
                <strong>
                    活動：
                </strong>

                ${escapeHtml(
                    data.eventName || ""
                )}
            </p>


            <p>
                <strong>
                    說明：
                </strong>

                ${escapeHtml(
                    data.eventDescription || ""
                )}
            </p>

        </div>
        `;

}



/* =========================================================
   工具函式
========================================================= */


/*
    設定 input / textarea 的值
*/

function setInputValue(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.value =
        value || "";

}



/*
    取得 input / textarea 的值
*/

function getInputValue(
    element
) {

    if (!element) {

        return "";

    }


    return element.value.trim();

}



/*
    安全顯示 HTML 文字

    避免使用者輸入：
    <script>
    <img>
    等 HTML 標籤直接被瀏覽器執行。
*/

function escapeHtml(text) {

    return String(
        text || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}