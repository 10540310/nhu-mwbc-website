/* =========================================================
   中智佛學社後台
   課程表管理程式
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
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
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
    Firestore Database ID：

    default

    注意不是：
    (default)
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
   課程表標題
------------------------- */

const courseTableTitle =
    document.getElementById(
        "courseTableTitle"
    );


const saveCourseTableTitleBtn =
    document.getElementById(
        "saveCourseTableTitleBtn"
    );



/* -------------------------
   新增課程
------------------------- */

const courseDate =
    document.getElementById(
        "courseDate"
    );


const courseName =
    document.getElementById(
        "courseName"
    );


const addCourseBtn =
    document.getElementById(
        "addCourseBtn"
    );



/* -------------------------
   課程列表
------------------------- */

const courseList =
    document.getElementById(
        "courseList"
    );



/* =========================================================
   管理員登入檢查
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
            未登入：
            返回後台登入頁。
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
            登入成功後讀取：

            1. 課程表標題
            2. 課程列表
        */

        await loadCourseTableTitle();

        await loadCourses();

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
   讀取課程表標題
========================================================= */

async function loadCourseTableTitle() {

    /*
        頁面找不到欄位時直接停止。
    */

    if (!courseTableTitle) {

        return;

    }


    try {

        /*
            課程表標題目前存放於：

            news
              └─ news
                   └─ courseTableTitle
        */

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "news",
                    "news"
                )
            );


        /*
            news/news 尚未建立
        */

        if (!snapshot.exists()) {

            courseTableTitle.value =
                "本學期課程表";

            return;

        }


        const data =
            snapshot.data();


        courseTableTitle.value =
            data.courseTableTitle ||
            "本學期課程表";


        console.log(
            "✅ 課程表標題讀取成功"
        );

    }
    catch (error) {

        console.error(
            "❌ 課程表標題讀取失敗：",
            error
        );

    }

}



/* =========================================================
   儲存課程表標題
========================================================= */

if (
    saveCourseTableTitleBtn &&
    courseTableTitle
) {

    saveCourseTableTitleBtn.addEventListener(
        "click",
        async () => {

            const title =
                courseTableTitle.value.trim();


            /*
                不允許空白標題
            */

            if (!title) {

                alert(
                    "請輸入課程表標題"
                );


                courseTableTitle.focus();

                return;

            }



            /* -------------------------
               按鈕儲存狀態
            ------------------------- */

            const originalText =
                saveCourseTableTitleBtn.textContent;


            saveCourseTableTitleBtn.disabled =
                true;


            saveCourseTableTitleBtn.textContent =
                "儲存中...";



            try {

                /*
                    使用 merge: true

                    避免覆蓋 news/news 裡：
                    - 最新消息
                    - 社課資訊
                    - 活動預告
                    等其他欄位。
                */

                await setDoc(
                    doc(
                        db,
                        "news",
                        "news"
                    ),
                    {

                        courseTableTitle:
                            title,

                        updatedAt:
                            serverTimestamp()

                    },
                    {

                        merge:
                            true

                    }
                );


                alert(
                    "課程表標題儲存成功"
                );


                console.log(
                    "✅ 課程表標題已更新：",
                    title
                );

            }
            catch (error) {

                console.error(
                    "❌ 課程表標題儲存失敗：",
                    error
                );


                alert(
                    "課程表標題儲存失敗"
                );

            }
            finally {

                saveCourseTableTitleBtn.disabled =
                    false;


                saveCourseTableTitleBtn.textContent =
                    originalText;

            }

        }
    );

}



/* =========================================================
   讀取課程列表
========================================================= */

async function loadCourses() {

    /*
        找不到課程列表時直接停止。
    */

    if (!courseList) {

        return;

    }


    courseList.innerHTML =
        `
        <p class="empty-message">
            課程資料載入中...
        </p>
        `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "courses"
                )
            );


        /*
            尚未建立任何課程
        */

        if (snapshot.empty) {

            courseList.innerHTML =
                `
                <p class="empty-message">
                    目前還沒有課程
                </p>
                `;

            return;

        }



        /* -------------------------
           整理 Firestore 資料
        ------------------------- */

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



        /* -------------------------
           依 order 排序
        ------------------------- */

        courses.sort(
            (a, b) => {

                return (
                    Number(a.order || 0) -
                    Number(b.order || 0)
                );

            }
        );



        /* -------------------------
           清空舊內容
        ------------------------- */

        courseList.innerHTML =
            "";



        /* -------------------------
           建立課程畫面
        ------------------------- */

        courses.forEach(
            course => {

                const item =
                    createCourseItem(
                        course
                    );


                courseList.appendChild(
                    item
                );

            }
        );


        console.log(
            "✅ 課程讀取成功"
        );

    }
    catch (error) {

        console.error(
            "❌ 課程讀取失敗：",
            error
        );


        courseList.innerHTML =
            `
            <p class="empty-message">
                課程載入失敗
            </p>
            `;

    }

}



/* =========================================================
   建立單一課程項目
========================================================= */

function createCourseItem(course) {

    /*
        整列
    */

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "course-admin-item";



    /*
        課程資訊區
    */

    const info =
        document.createElement(
            "div"
        );



    /* 日期 */

    const date =
        document.createElement(
            "strong"
        );


    date.textContent =
        course.date || "";



    /* 課程名稱 */

    const name =
        document.createElement(
            "span"
        );


    name.textContent =
        course.name || "";



    info.appendChild(
        date
    );


    info.appendChild(
        name
    );



    /*
        按鈕區
    */

    const buttonBox =
        document.createElement(
            "div"
        );


    buttonBox.className =
        "course-button-box";



    /* -------------------------
       編輯按鈕
    ------------------------- */

    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.textContent =
        "編輯";


    editButton.className =
        "edit-course-btn";


    editButton.addEventListener(
        "click",
        () => {

            editCourse(
                course.id,
                course.date,
                course.name
            );

        }
    );



    /* -------------------------
       刪除按鈕
    ------------------------- */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.textContent =
        "刪除";


    deleteButton.className =
        "delete-course-btn";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteCourse(
                course.id,
                course.date,
                course.name
            );

        }
    );



    buttonBox.appendChild(
        editButton
    );


    buttonBox.appendChild(
        deleteButton
    );


    item.appendChild(
        info
    );


    item.appendChild(
        buttonBox
    );


    return item;

}



/* =========================================================
   新增課程
========================================================= */

if (
    addCourseBtn &&
    courseDate &&
    courseName
) {

    addCourseBtn.addEventListener(
        "click",
        async () => {

            const date =
                courseDate.value.trim();


            const name =
                courseName.value.trim();



            /*
                日期不能空白
            */

            if (!date) {

                alert(
                    "請輸入課程日期"
                );


                courseDate.focus();

                return;

            }



            /*
                課程主題不能空白
            */

            if (!name) {

                alert(
                    "請輸入課程主題"
                );


                courseName.focus();

                return;

            }



            /* -------------------------
               新增狀態
            ------------------------- */

            const originalText =
                addCourseBtn.textContent;


            addCourseBtn.disabled =
                true;


            addCourseBtn.textContent =
                "新增中...";



            try {

                await addDoc(
                    collection(
                        db,
                        "courses"
                    ),
                    {

                        date:
                            date,

                        name:
                            name,

                        /*
                            用目前時間作為排序值。
                            新增越晚，數值越大。
                        */

                        order:
                            Date.now(),

                        createdAt:
                            serverTimestamp()

                    }
                );



                /*
                    新增完成後清空輸入框
                */

                courseDate.value =
                    "";


                courseName.value =
                    "";



                alert(
                    "課程新增成功！"
                );



                /*
                    重新讀取課程列表
                */

                await loadCourses();

            }
            catch (error) {

                console.error(
                    "❌ 新增課程失敗：",
                    error
                );


                alert(
                    "新增課程失敗"
                );

            }
            finally {

                addCourseBtn.disabled =
                    false;


                addCourseBtn.textContent =
                    originalText;

            }

        }
    );

}



/* =========================================================
   編輯課程
========================================================= */

async function editCourse(
    id,
    oldDate,
    oldName
) {

    /*
        修改日期
    */

    const newDate =
        prompt(
            "修改課程日期：",
            oldDate || ""
        );


    /*
        使用者按取消
    */

    if (newDate === null) {

        return;

    }


    const trimmedDate =
        newDate.trim();


    if (!trimmedDate) {

        alert(
            "課程日期不能空白"
        );

        return;

    }



    /*
        修改課程名稱
    */

    const newName =
        prompt(
            "修改課程主題：",
            oldName || ""
        );


    /*
        使用者按取消
    */

    if (newName === null) {

        return;

    }


    const trimmedName =
        newName.trim();


    if (!trimmedName) {

        alert(
            "課程主題不能空白"
        );

        return;

    }



    try {

        await updateDoc(
            doc(
                db,
                "courses",
                id
            ),
            {

                date:
                    trimmedDate,

                name:
                    trimmedName,

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "課程修改成功！"
        );


        await loadCourses();

    }
    catch (error) {

        console.error(
            "❌ 修改課程失敗：",
            error
        );


        alert(
            "修改課程失敗"
        );

    }

}



/* =========================================================
   刪除課程
========================================================= */

async function deleteCourse(
    id,
    date,
    name
) {

    const confirmed =
        confirm(
            `確定要刪除這堂課嗎？

${date || ""} ${name || ""}`
        );


    if (!confirmed) {

        return;

    }



    try {

        await deleteDoc(
            doc(
                db,
                "courses",
                id
            )
        );


        alert(
            "課程已刪除"
        );


        await loadCourses();

    }
    catch (error) {

        console.error(
            "❌ 刪除課程失敗：",
            error
        );


        alert(
            "刪除課程失敗"
        );

    }

}