/* =========================================================
   中智佛學社後台
   網站設定管理程式
========================================================= */


/* =========================================================
   1. Firebase App
========================================================= */

import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";



/* =========================================================
   2. Firebase Authentication
========================================================= */

import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";



/* =========================================================
   3. Firebase Firestore
========================================================= */

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



/* =========================================================
   4. Firebase 設定
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
   5. Firebase 初始化
========================================================= */

const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(
        app
    );


/*
    注意：

    你的 Firestore Database ID 是：

    default

    不是：

    (default)
*/

const db =
    getFirestore(
        app,
        "default"
    );



/* =========================================================
   6. Firestore 文件位置
========================================================= */

/*
    網站設定統一存放：

    settings
        └─ site
*/

const settingsRef =
    doc(
        db,
        "settings",
        "site"
    );



/* =========================================================
   7. 取得 HTML 元素
========================================================= */


/* -------------------------
   首頁內容
------------------------- */

const heroSubtitle =
    document.getElementById(
        "heroSubtitle"
    );


const heroDescription =
    document.getElementById(
        "heroDescription"
    );



/* -------------------------
   社課資訊
------------------------- */

const clubTime =
    document.getElementById(
        "clubTime"
    );


const clubLocation =
    document.getElementById(
        "clubLocation"
    );



/* -------------------------
   聯絡方式
------------------------- */

const instagram =
    document.getElementById(
        "instagram"
    );


const line =
    document.getElementById(
        "line"
    );


const email =
    document.getElementById(
        "email"
    );



/* -------------------------
   操作元件
------------------------- */

const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );


const message =
    document.getElementById(
        "message"
    );



/* =========================================================
   8. 管理員登入檢查
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
            如果沒有登入 Firebase，
            不允許進入管理頁。
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
            從 Firestore 載入目前網站設定。
        */

        await loadSettings();

    }
);



/* =========================================================
   9. 登出功能
========================================================= */

window.logout =
    async function () {

        try {

            await signOut(
                auth
            );


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
   10. 讀取網站設定
========================================================= */

async function loadSettings() {

    try {

        showMessage(
            "網站設定載入中..."
        );


        /*
            讀取：

            settings/site
        */

        const snapshot =
            await getDoc(
                settingsRef
            );



        /*
            第一次使用時，
            Firestore 可能還沒有 settings/site。
        */

        if (!snapshot.exists()) {

            console.log(
                "⚠️ 尚未建立 settings/site"
            );


            showMessage(
                "目前尚未建立網站設定，可以直接填寫後儲存。"
            );


            return;

        }



        /*
            取得 Firestore 資料
        */

        const data =
            snapshot.data();



        /* =================================================
           首頁內容
        ================================================= */

        setInputValue(
            heroSubtitle,
            data.heroSubtitle
        );


        setInputValue(
            heroDescription,
            data.heroDescription
        );



        /* =================================================
           社課資訊
        ================================================= */

        setInputValue(
            clubTime,
            data.clubTime
        );


        setInputValue(
            clubLocation,
            data.clubLocation
        );



        /* =================================================
           聯絡方式
        ================================================= */

        setInputValue(
            instagram,
            data.instagram
        );


        setInputValue(
            line,
            data.line
        );


        setInputValue(
            email,
            data.email
        );



        showMessage(
            "網站設定載入完成"
        );


        console.log(
            "✅ 網站設定讀取成功"
        );

    }
    catch (error) {

        console.error(
            "❌ 網站設定讀取失敗：",
            error
        );


        showMessage(
            "網站設定載入失敗，請檢查 Firestore 權限。"
        );

    }

}



/* =========================================================
   11. 儲存網站設定
========================================================= */

if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        async () => {


            /* -------------------------
               取得目前按鈕文字
            ------------------------- */

            const originalText =
                saveSettingsBtn.textContent;



            /* -------------------------
               儲存中狀態
            ------------------------- */

            saveSettingsBtn.disabled =
                true;


            saveSettingsBtn.textContent =
                "儲存中...";


            showMessage(
                "正在儲存網站設定..."
            );



            try {

                /*
                    建立要儲存的資料
                */

                const settingsData = {


                    /* =====================
                       首頁
                    ===================== */

                    heroSubtitle:
                        getInputValue(
                            heroSubtitle
                        ),


                    heroDescription:
                        getInputValue(
                            heroDescription
                        ),



                    /* =====================
                       社課
                    ===================== */

                    clubTime:
                        getInputValue(
                            clubTime
                        ),


                    clubLocation:
                        getInputValue(
                            clubLocation
                        ),



                    /* =====================
                       聯絡方式
                    ===================== */

                    instagram:
                        getInputValue(
                            instagram
                        ),


                    line:
                        getInputValue(
                            line
                        ),


                    email:
                        getInputValue(
                            email
                        ),



                    /* =====================
                       更新時間
                    ===================== */

                    updatedAt:
                        serverTimestamp()

                };



                /*
                    寫入：

                    settings/site

                    merge:true
                    可以避免未來增加其他設定欄位時，
                    儲存這一頁就把其他欄位刪掉。
                */

                await setDoc(
                    settingsRef,
                    settingsData,
                    {
                        merge:true
                    }
                );



                showMessage(
                    "網站設定儲存成功！"
                );


                console.log(
                    "✅ 網站設定儲存成功"
                );

            }
            catch (error) {

                console.error(
                    "❌ 網站設定儲存失敗：",
                    error
                );


                showMessage(
                    "網站設定儲存失敗，請檢查 Firestore 權限。"
                );

            }
            finally {

                /*
                    恢復按鈕
                */

                saveSettingsBtn.disabled =
                    false;


                saveSettingsBtn.textContent =
                    originalText;

            }

        }
    );

}



/* =========================================================
   12. 設定輸入框內容
========================================================= */

function setInputValue(
    element,
    value
) {

    /*
        元素不存在時直接停止，
        避免 JavaScript 報錯。
    */

    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}



/* =========================================================
   13. 取得輸入框內容
========================================================= */

function getInputValue(
    element
) {

    if (!element) {

        return "";

    }


    return element.value.trim();

}



/* =========================================================
   14. 顯示操作訊息
========================================================= */

function showMessage(
    text
) {

    if (!message) {

        return;

    }


    message.textContent =
        text;

}