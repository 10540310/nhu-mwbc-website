// ======================================================
// 南華大學中智佛學社
// 活動照片管理
// ======================================================


// ======================================================
// Firebase
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";



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



const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);



// ======================================================
// Cloudflare Worker
// ======================================================

const API_URL =
    "https://nhu-mwbc-photo-api.wub955887.workers.dev";



// ======================================================
// DOM
// ======================================================

const featuredList =
    document.getElementById(
        "featuredList"
    );


const galleryList =
    document.getElementById(
        "galleryList"
    );


const featuredCount =
    document.getElementById(
        "featuredCount"
    );


const galleryCount =
    document.getElementById(
        "galleryCount"
    );


const featuredFile =
    document.getElementById(
        "featuredFile"
    );


const galleryFile =
    document.getElementById(
        "galleryFile"
    );


const uploadFeaturedBtn =
    document.getElementById(
        "uploadFeaturedBtn"
    );


const uploadGalleryBtn =
    document.getElementById(
        "uploadGalleryBtn"
    );


const statusMessage =
    document.getElementById(
        "statusMessage"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );



// ======================================================
// 照片資料
// ======================================================

let photoData = {

    featured: [],

    gallery: []

};


let currentUser = null;


let operationRunning =
    false;



// ======================================================
// Firebase 登入驗證
// ======================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "admin-login.html";

            return;

        }


        currentUser =
            user;


        try {

            // 先確認這個 Firebase 帳號
            // 確實存在於 Worker 的 ADMIN_UIDS

            await verifyAdmin();


            await loadPhotos();


        } catch (error) {

            console.error(
                error
            );


            showMessage(
                error.message ||
                "管理員驗證失敗",
                "error"
            );


            featuredList.innerHTML =
                `
                    <p class="empty-text">
                        無法載入活動精選
                    </p>
                `;


            galleryList.innerHTML =
                `
                    <p class="empty-text">
                        無法載入活動照片
                    </p>
                `;

        }

    }
);



// ======================================================
// 登出
// ======================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);


                window.location.href =
                    "admin-login.html";


            } catch (error) {

                console.error(
                    error
                );


                showMessage(
                    "登出失敗",
                    "error"
                );

            }

        }
    );

}



// ======================================================
// 驗證 Worker 管理員權限
// ======================================================

async function verifyAdmin() {

    const response =
        await adminFetch(
            "/api/admin/test",
            {
                method: "GET"
            }
        );


    const data =
        await readJsonResponse(
            response
        );


    if (
        !response.ok ||
        !data.success
    ) {

        throw new Error(
            data.message ||
            "此帳號沒有活動照片管理權限"
        );

    }


    return true;

}



// ======================================================
// 載入照片
// ======================================================

async function loadPhotos() {

    featuredList.innerHTML =
        `
            <p class="loading-text">
                活動精選載入中...
            </p>
        `;


    galleryList.innerHTML =
        `
            <p class="loading-text">
                活動照片載入中...
            </p>
        `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/photos`,
                {
                    method: "GET",

                    cache:
                        "no-store"
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "照片資料載入失敗"
            );

        }


        photoData = {

            featured:
                Array.isArray(
                    data.featured
                )
                    ? data.featured
                    : [],

            gallery:
                Array.isArray(
                    data.gallery
                )
                    ? data.gallery
                    : []

        };


        renderPhotos();


    } catch (error) {

        console.error(
            error
        );


        featuredList.innerHTML =
            `
                <p class="empty-text">
                    活動精選載入失敗
                </p>
            `;


        galleryList.innerHTML =
            `
                <p class="empty-text">
                    活動照片載入失敗
                </p>
            `;


        showMessage(
            error.message ||
            "照片資料載入失敗",
            "error"
        );

    }

}



// ======================================================
// 顯示全部照片
// ======================================================

function renderPhotos() {

    renderCategory(
        "featured",
        featuredList
    );


    renderCategory(
        "gallery",
        galleryList
    );


    featuredCount.textContent =
        `${photoData.featured.length} 張`;


    galleryCount.textContent =
        `${photoData.gallery.length} 張`;

}



// ======================================================
// 顯示單一分類
// ======================================================

function renderCategory(
    category,
    container
) {

    const photos =
        photoData[category];


    if (
        !photos ||
        photos.length === 0
    ) {

        container.innerHTML =
            `
                <p class="empty-text">
                    目前沒有照片
                </p>
            `;

        return;

    }


    container.innerHTML = "";


    photos.forEach(
        (
            fileName,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "photo-card";


            const imageUrl =
                `../assets/${encodeURIComponent(fileName)}`;


            card.innerHTML =
                `
                    <img
                        src="${imageUrl}"
                        class="photo-preview"
                        alt="活動照片"
                    >

                    <div class="photo-info">

                        <div class="photo-name">
                            ${escapeHtml(fileName)}
                        </div>

                        <div class="photo-position">
                            顯示順序：${index + 1}
                        </div>

                        <div class="photo-actions">

                            <button
                                type="button"
                                class="move-button move-up"
                                ${index === 0
                                    ? "disabled"
                                    : ""}
                            >
                                ↑ 上移
                            </button>


                            <button
                                type="button"
                                class="move-button move-down"
                                ${index === photos.length - 1
                                    ? "disabled"
                                    : ""}
                            >
                                ↓ 下移
                            </button>


                            <button
                                type="button"
                                class="delete-button delete-photo"
                            >
                                刪除照片
                            </button>

                        </div>

                    </div>
                `;


            const upButton =
                card.querySelector(
                    ".move-up"
                );


            const downButton =
                card.querySelector(
                    ".move-down"
                );


            const deleteButton =
                card.querySelector(
                    ".delete-photo"
                );


            upButton.addEventListener(
                "click",
                () => {

                    movePhoto(
                        category,
                        index,
                        -1
                    );

                }
            );


            downButton.addEventListener(
                "click",
                () => {

                    movePhoto(
                        category,
                        index,
                        1
                    );

                }
            );


            deleteButton.addEventListener(
                "click",
                () => {

                    deletePhoto(
                        category,
                        fileName
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}



// ======================================================
// 活動精選上傳
// ======================================================

uploadFeaturedBtn.addEventListener(
    "click",
    async () => {

        await uploadPhoto(
            "featured",
            featuredFile,
            uploadFeaturedBtn
        );

    }
);



// ======================================================
// 活動照片上傳
// ======================================================

uploadGalleryBtn.addEventListener(
    "click",
    async () => {

        await uploadPhoto(
            "gallery",
            galleryFile,
            uploadGalleryBtn
        );

    }
);



// ======================================================
// 上傳照片
// ======================================================

async function uploadPhoto(
    category,
    fileInput,
    button
) {

    if (operationRunning) {

        return;

    }


    const file =
        fileInput.files[0];


    if (!file) {

        showMessage(
            "請先選擇照片",
            "error"
        );

        return;

    }


    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showMessage(
            "只允許 JPG、PNG、WEBP 圖片",
            "error"
        );

        return;

    }


    const maxSize =
        8 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        showMessage(
            "單張照片不可超過 8 MB",
            "error"
        );

        return;

    }


    operationRunning =
        true;


    const originalText =
        button.textContent;


    button.disabled =
        true;


    button.textContent =
        "上傳中...";


    showMessage(
        "正在上傳照片，請勿關閉頁面...",
        "info"
    );


    try {

        const base64 =
            await fileToBase64(
                file
            );


        const response =
            await adminFetch(
                "/api/admin/upload",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            category:
                                category,

                            fileName:
                                file.name,

                            content:
                                base64

                        })
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "照片上傳失敗"
            );

        }


        fileInput.value = "";


        showMessage(
            "照片上傳成功。GitHub Pages 更新可能需要一點時間。",
            "success"
        );


        await loadPhotos();


    } catch (error) {

        console.error(
            error
        );


        showMessage(
            error.message ||
            "照片上傳失敗",
            "error"
        );


    } finally {

        operationRunning =
            false;


        button.disabled =
            false;


        button.textContent =
            originalText;

    }

}



// ======================================================
// 上移 / 下移
// ======================================================

async function movePhoto(
    category,
    index,
    direction
) {

    if (operationRunning) {

        return;

    }


    const newIndex =
        index + direction;


    if (
        newIndex < 0 ||
        newIndex >=
            photoData[category].length
    ) {

        return;

    }


    const oldData = {

        featured:
            [...photoData.featured],

        gallery:
            [...photoData.gallery]

    };


    const list =
        photoData[category];


    [
        list[index],
        list[newIndex]
    ] = [
        list[newIndex],
        list[index]
    ];


    renderPhotos();


    operationRunning =
        true;


    showMessage(
        "正在儲存照片順序...",
        "info"
    );


    try {

        const response =
            await adminFetch(
                "/api/admin/order",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            featured:
                                photoData.featured,

                            gallery:
                                photoData.gallery

                        })
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "照片排序儲存失敗"
            );

        }


        showMessage(
            "照片順序已儲存",
            "success"
        );


        await loadPhotos();


    } catch (error) {

        console.error(
            error
        );


        photoData = oldData;


        renderPhotos();


        showMessage(
            error.message ||
            "照片排序儲存失敗",
            "error"
        );


    } finally {

        operationRunning =
            false;

    }

}



// ======================================================
// 刪除照片
// ======================================================

async function deletePhoto(
    category,
    fileName
) {

    if (operationRunning) {

        return;

    }


    const categoryName =
        category === "featured"
            ? "活動精選"
            : "活動照片";


    const confirmed =
        confirm(
            `確定要刪除這張${categoryName}嗎？\n\n${fileName}\n\n刪除後會同時從 GitHub 移除圖片檔案。`
        );


    if (!confirmed) {

        return;

    }


    operationRunning =
        true;


    setAllButtonsDisabled(
        true
    );


    showMessage(
        "正在刪除照片，請勿關閉頁面...",
        "info"
    );


    try {

        const response =
            await adminFetch(
                "/api/admin/photo",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            category:
                                category,

                            fileName:
                                fileName

                        })
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "照片刪除失敗"
            );

        }


        showMessage(
            "照片已刪除",
            "success"
        );


        await loadPhotos();


    } catch (error) {

        console.error(
            error
        );


        showMessage(
            error.message ||
            "照片刪除失敗",
            "error"
        );


        await loadPhotos();


    } finally {

        operationRunning =
            false;


        setAllButtonsDisabled(
            false
        );

    }

}



// ======================================================
// 管理員 API Fetch
// ======================================================

async function adminFetch(
    endpoint,
    options = {}
) {

    if (!currentUser) {

        throw new Error(
            "尚未登入管理員"
        );

    }


    const idToken =
        await currentUser
            .getIdToken();


    const headers = {

        ...(options.headers || {}),

        "Authorization":
            `Bearer ${idToken}`

    };


    return fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers:
                headers
        }
    );

}



// ======================================================
// File → Base64
// ======================================================

function fileToBase64(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "照片讀取失敗"
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}



// ======================================================
// API Response
// ======================================================

async function readJsonResponse(
    response
) {

    try {

        return await response.json();

    } catch {

        return {
            success: false,

            message:
                `API 回傳格式錯誤（HTTP ${response.status}）`
        };

    }

}



// ======================================================
// 訊息
// ======================================================

function showMessage(
    message,
    type = "info"
) {

    statusMessage.textContent =
        message;


    statusMessage.className =
        `status-message show ${type}`;

}



// ======================================================
// 暫時鎖定所有照片按鈕
// ======================================================

function setAllButtonsDisabled(
    disabled
) {

    const buttons =
        document.querySelectorAll(
            ".photo-actions button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                disabled;

        }
    );

}



// ======================================================
// HTML Escape
// ======================================================

function escapeHtml(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}