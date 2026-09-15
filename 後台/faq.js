/* =========================================================
   中智佛學社後台
   Q&A 管理程式
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
    updateDoc,
    deleteDoc,
    doc,
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
    Firestore Database ID 是：

    default
*/

const db =
    getFirestore(
        app,
        "default"
    );



/* =========================================================
   DOM 元素
========================================================= */

const questionInput =
    document.getElementById(
        "question"
    );


const answerInput =
    document.getElementById(
        "answer"
    );


const addFaqButton =
    document.getElementById(
        "addFaqButton"
    );


const faqList =
    document.getElementById(
        "faqList"
    );


const message =
    document.getElementById(
        "message"
    );



/* =========================================================
   管理員登入檢查
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
            沒有登入就回到登入頁。
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
            登入成功後讀取 Q&A。
        */

        await loadFaqs();

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
   讀取所有 Q&A
========================================================= */

async function loadFaqs() {

    if (!faqList) {

        return;

    }


    faqList.innerHTML =
        `
        <p class="empty-message">
            Q&A 資料載入中...
        </p>
        `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "faqs"
                )
            );


        /*
            Firestore 還沒有任何 Q&A。
        */

        if (snapshot.empty) {

            faqList.innerHTML =
                `
                <p class="empty-message">
                    目前還沒有建立 Q&A
                </p>
                `;

            return;

        }



        /* -------------------------
           整理資料
        ------------------------- */

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



        /* -------------------------
           依 order 排序
        ------------------------- */

        faqs.sort(
            (a, b) => {

                return (
                    Number(a.order || 0) -
                    Number(b.order || 0)
                );

            }
        );



        /* -------------------------
           清空載入訊息
        ------------------------- */

        faqList.innerHTML =
            "";



        /* -------------------------
           建立 Q&A
        ------------------------- */

        faqs.forEach(
            faq => {

                const item =
                    createFaqItem(
                        faq
                    );


                faqList.appendChild(
                    item
                );

            }
        );


        console.log(
            "✅ Q&A 讀取成功"
        );

    }
    catch (error) {

        console.error(
            "❌ Q&A 讀取失敗：",
            error
        );


        faqList.innerHTML =
            `
            <p class="empty-message">
                Q&A 載入失敗，請檢查 Firestore 權限。
            </p>
            `;

    }

}



/* =========================================================
   建立單一 Q&A 項目
========================================================= */

function createFaqItem(faq) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "faq-admin-item";



    /* -------------------------
       問題
    ------------------------- */

    const question =
        document.createElement(
            "h3"
        );


    question.textContent =
        `Q：${faq.question || ""}`;



    /* -------------------------
       回答
    ------------------------- */

    const answer =
        document.createElement(
            "p"
        );


    answer.textContent =
        `A：${faq.answer || ""}`;



    /* -------------------------
       按鈕區
    ------------------------- */

    const buttonBox =
        document.createElement(
            "div"
        );


    buttonBox.className =
        "faq-button-box";



    /* 編輯按鈕 */

    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.className =
        "edit-faq-btn";


    editButton.textContent =
        "編輯";


    editButton.addEventListener(
        "click",
        () => {

            editFaq(
                faq.id,
                faq.question,
                faq.answer
            );

        }
    );



    /* 刪除按鈕 */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-faq-btn";


    deleteButton.textContent =
        "刪除";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteFaq(
                faq.id,
                faq.question
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
        question
    );


    item.appendChild(
        answer
    );


    item.appendChild(
        buttonBox
    );


    return item;

}



/* =========================================================
   新增 Q&A
========================================================= */

if (
    addFaqButton &&
    questionInput &&
    answerInput
) {

    addFaqButton.addEventListener(
        "click",
        async () => {

            const question =
                questionInput.value.trim();


            const answer =
                answerInput.value.trim();



            /* -------------------------
               檢查問題
            ------------------------- */

            if (!question) {

                showMessage(
                    "請輸入問題"
                );


                questionInput.focus();

                return;

            }



            /* -------------------------
               檢查回答
            ------------------------- */

            if (!answer) {

                showMessage(
                    "請輸入回答"
                );


                answerInput.focus();

                return;

            }



            /* -------------------------
               按鈕進入新增狀態
            ------------------------- */

            const originalText =
                addFaqButton.textContent;


            addFaqButton.disabled =
                true;


            addFaqButton.textContent =
                "新增中...";



            try {

                /*
                    先讀取目前所有 FAQ，
                    找出最大的 order。

                    不使用 snapshot.size + 1，
                    避免刪除 FAQ 後產生重複 order。
                */

                const snapshot =
                    await getDocs(
                        collection(
                            db,
                            "faqs"
                        )
                    );


                let maxOrder = 0;


                snapshot.forEach(
                    documentSnapshot => {

                        const data =
                            documentSnapshot.data();


                        const currentOrder =
                            Number(
                                data.order || 0
                            );


                        if (
                            currentOrder >
                            maxOrder
                        ) {

                            maxOrder =
                                currentOrder;

                        }

                    }
                );


                const nextOrder =
                    maxOrder + 1;



                /* -------------------------
                   寫入 Firestore
                ------------------------- */

                await addDoc(
                    collection(
                        db,
                        "faqs"
                    ),
                    {

                        question:
                            question,

                        answer:
                            answer,

                        order:
                            nextOrder,

                        createdAt:
                            serverTimestamp()

                    }
                );



                /* -------------------------
                   清空輸入框
                ------------------------- */

                questionInput.value =
                    "";


                answerInput.value =
                    "";



                showMessage(
                    "Q&A 新增成功！"
                );


                /*
                    重新讀取列表
                */

                await loadFaqs();

            }
            catch (error) {

                console.error(
                    "❌ Q&A 新增失敗：",
                    error
                );


                showMessage(
                    "Q&A 新增失敗"
                );

            }
            finally {

                addFaqButton.disabled =
                    false;


                addFaqButton.textContent =
                    originalText;

            }

        }
    );

}



/* =========================================================
   編輯 Q&A
========================================================= */

async function editFaq(
    id,
    oldQuestion,
    oldAnswer
) {

    /*
        修改問題
    */

    const newQuestion =
        prompt(
            "修改問題：",
            oldQuestion || ""
        );


    if (newQuestion === null) {

        return;

    }


    const trimmedQuestion =
        newQuestion.trim();


    if (!trimmedQuestion) {

        alert(
            "問題不能空白"
        );

        return;

    }



    /*
        修改回答
    */

    const newAnswer =
        prompt(
            "修改回答：",
            oldAnswer || ""
        );


    if (newAnswer === null) {

        return;

    }


    const trimmedAnswer =
        newAnswer.trim();


    if (!trimmedAnswer) {

        alert(
            "回答不能空白"
        );

        return;

    }



    try {

        await updateDoc(
            doc(
                db,
                "faqs",
                id
            ),
            {

                question:
                    trimmedQuestion,

                answer:
                    trimmedAnswer,

                updatedAt:
                    serverTimestamp()

            }
        );


        showMessage(
            "Q&A 修改成功！"
        );


        await loadFaqs();

    }
    catch (error) {

        console.error(
            "❌ Q&A 修改失敗：",
            error
        );


        showMessage(
            "Q&A 修改失敗"
        );

    }

}



/* =========================================================
   刪除 Q&A
========================================================= */

async function deleteFaq(
    id,
    question
) {

    const confirmed =
        confirm(
            `確定要刪除這個 Q&A 嗎？

${question || ""}`
        );


    if (!confirmed) {

        return;

    }



    try {

        await deleteDoc(
            doc(
                db,
                "faqs",
                id
            )
        );


        showMessage(
            "Q&A 已刪除"
        );


        await loadFaqs();

    }
    catch (error) {

        console.error(
            "❌ Q&A 刪除失敗：",
            error
        );


        showMessage(
            "Q&A 刪除失敗"
        );

    }

}



/* =========================================================
   顯示操作訊息
========================================================= */

function showMessage(text) {

    if (!message) {

        return;

    }


    message.textContent =
        text;

}