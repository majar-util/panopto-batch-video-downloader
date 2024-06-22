// ==UserScript==
// @name         panopto-batch-downloader
// @description	 This is a script that downloads all videos in a folder in Panopto Video platform
// @namespace    https://github.com/majar-util/panopto-batch-video-downloader
// @version      0.1.0
// @author       majar5c
// @match        https://*.panopto.com/Panopto/Pages/Sessions/*
// @icon         https://github.com/majar-util/panopto-batch-video-downloader/blob/d5986221f4045a04025e782f4d665a6486c198cb/favicon.png?raw=true
// @license      MIT
// @grant        GM_openInTab
// ==/UserScript==

(function main() {
    'use strict';

    const inFolderPage = getURLHashParameters().has("folderID");

    if (inFolderPage) {
        injectDownloadButton();


        const host = window.location.host.replace('.panopto.com', '');
    
        function injectDownloadButton() {
            const btn = document.createElement("button");
            btn.setAttribute("class", "MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary sort-menu-button css-knsjct");
            btn.setAttribute("id", "download-button");
            btn.setAttribute("type", "button");
            btn.style.margin = "0 20px";
            btn.innerText = "Download All";
    
            btn.addEventListener("click", downloadVideos);
    
            const toolBar = document.querySelector("#actionHeader > div");
            toolBar == null ? void 0 : toolBar.appendChild(btn);
        }
    
        function downloadVideos() {
            var video_ids = getVideosIds();
            video_ids.forEach((id) => {
                if (id) {
                    makeGetRequest(`https://${host}.panopto.com/Panopto/Podcast/Download/${id}.mp4?mediaTargetType=videoPodcast`);
                }
            })
        }
    
        function getVideosIds() {
            var urls = [...document.querySelectorAll('a.thumbnail-link, a.list-title')].map((x) => x.href);
    
            const regex = /id=([a-f\d-]+)/i;
            function extractId(url) {
                var match = url.match(regex);
                return match ? match[1] : null;
            }
    
            return urls.map((url) => extractId(url))
        }
    
        function makeGetRequest(url) {
            if (typeof GM_openInTab !== 'undefined') {
                GM_openInTab(url, false);
            }
        }        
    }

    function getURLHashParameters() {
        const params = new URLSearchParams(window.location.hash.substring(1)); // Remove the leading '#'
        return params;
    }
})()
