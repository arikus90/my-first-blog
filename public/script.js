// ==========================================================================
// 1. MODAL WINDOW (At the very top, outside functions)
// ==========================================================================
const modal = document.getElementById("commentsModal");
const closeModalBtn = document.querySelector(".close-modal");

if (modal && closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// ==========================================================================
// 2. MAIN PAGE FUNCTION (Cards, frames, and comments)
// ==========================================================================
function initpage() {
    var wholeGrid = document.querySelectorAll('.grid-item');
    
    wholeGrid.forEach(card => {
        // --- Frame Logic ---
        var blockButton = card.querySelectorAll('.frame-btn, .no-frame-click');
        blockButton.forEach(itemButton => {
            itemButton.addEventListener("click", function() {
                var framedItem = card.querySelector(".frame-overlay");
                if (framedItem) {
                    framedItem.className = "frame-overlay";
                    for (let i = 1; i <= 3; i++) {
                        if (itemButton.classList.contains('ramka' + i)) {
                            framedItem.classList.add('ramka' + i + '-big');
                            break;
                        }
                    }
                }
            });
        });

        // --- Comment Submission Logic ---
        var submitBtn = card.querySelector(".submitBtnStyle");
        if (submitBtn) {
            submitBtn.addEventListener("click", function(e) {
                e.preventDefault();
                
                const questComment = card.querySelector(".comments-list");
                const commentInput = card.querySelector(".commentInputStyle");
                const commentTextarea = card.querySelector(".commentTextareaStyle");

                if (!commentInput || !commentTextarea) return;

                var questName = commentInput.value;
                var content = commentTextarea.value;

                if (questName === "" || content === "") {
                    alert("Name or comment cannot be empty.");
                    return;
                }

                var readyComment = {
                    name: questName,
                    text: content
                };

                fetch("/add-comment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(readyComment)
                })
                .then(response => response.json())
                .then(allComments => {
                    if (questComment) {
                        renderComments(questComment, allComments);
                    }
                    
                    commentInput.value = "";
                    commentTextarea.value = "";
                });
            });
        }

        // Вспомогательная функция для генерации комментов с кнопками Edit/Delete
        function renderComments(container, comments) {
            container.innerHTML = "";
            
            comments.forEach((comment, index) => {
                var commentDiv = document.createElement("div");
                commentDiv.classList.add("comment-item");
                commentDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";
                
                var contentContainer = document.createElement("div");
                contentContainer.classList.add("comment-content-box");
                contentContainer.style.flexGrow = "1";
                contentContainer.innerHTML = `<span class="comment-author" style="font-weight: bold; color: azure;">${comment.name}:</span> <span class="comment-text" style="color: #ccc;">${comment.text}</span>`;
                
                var actionsContainer = document.createElement("div");
                actionsContainer.style.cssText = "display: flex; gap: 5px; margin-left: 10px;";

                // Кнопка Edit (Редактировать)
                var editBtn = document.createElement("button");
                editBtn.innerText = "Edit";
                editBtn.style.cssText = "background-color: #ffe066; color: #333; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 11px;";
                editBtn.addEventListener("click", () => {
                    const newText = prompt("Edit your comment:", comment.text);
                    if (newText === null) return;
                    if (newText.trim() === "") {
                        alert("Comment cannot be empty.");
                        return;
                    }
                    
                    fetch("/edit-comment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ index: index, text: newText })
                    })
                    .then(res => res.json())
                    .then(updatedComments => {
                        renderComments(container, updatedComments);
                    });
                });

                // Кнопка Delete (Удалить)
                var deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Delete";
                deleteBtn.style.cssText = "background-color: #ff3333; color: white; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 11px;";
                deleteBtn.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this comment?")) {
                        fetch("/delete-comment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ index: index })
                        })
                        .then(res => res.json())
                        .then(updatedComments => {
                            renderComments(container, updatedComments);
                        });
                    }
                });

                actionsContainer.appendChild(editBtn);
                actionsContainer.appendChild(deleteBtn);
                
                commentDiv.appendChild(contentContainer);
                commentDiv.appendChild(actionsContainer);
                container.appendChild(commentDiv);
            });
        }

        // --- "Show all comments" Button Logic ---
        var showAllBtn = card.querySelector(".show-all-btn");
        if (showAllBtn) {
            showAllBtn.addEventListener("click", () => {
                const currentCommentsList = card.querySelector(".comments-list");
                const modalCommentsList = document.getElementById("modalCommentsList");
                
                if (currentCommentsList && modalCommentsList) {
                    modalCommentsList.innerHTML = currentCommentsList.innerHTML;
                    modal.style.display = "block";
                }
            });
        }
    });
}

// ==========================================================================
// 3. BIRTHDAY FUNCTION (Separate from initpage)
// ==========================================================================
let clickCount = 0; 

function checkBirthday() {
    const bdayText = document.getElementById("bdayText");
    const celebrateBtn = document.getElementById("celebrateBtn");

    if (!bdayText || !celebrateBtn) return;

    const today = new Date(); 
    const currentYear = today.getFullYear();
    let bdayDate = new Date(currentYear, 6, 23); 

    if (today > bdayDate && today.getDate() !== 23) {
        bdayDate.setFullYear(currentYear + 1);
    }

    const diffTime = bdayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (today.getDate() === 23 && today.getMonth() === 6) {
        bdayText.textContent = "Today is my Birthday!";
        celebrateBtn.style.display = "block";

        celebrateBtn.onclick = () => {
            clickCount++;

            if (!document.getElementById("hugeBdayText")) {
                const hugeText = document.createElement("div");
                hugeText.id = "hugeBdayText";
                hugeText.innerHTML = "HAPPY BIRTHDAY TO ME! 🎂🎉";
                hugeText.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); font-size:40px; color:#ff3333; font-weight:bold; z-index:10000; text-shadow: 0 0 20px rgba(255, 51, 51, 0.8); background:rgba(0,0,0,0.8); padding:20px 40px; border-radius:10px; pointer-events:none; border: 2px solid #ff3333;";
                document.body.appendChild(hugeText);
                
                setTimeout(() => hugeText.remove(), 3000);
            }

            if (clickCount % 2 !== 0) {
                confetti({
                    particleCount: 400,
                    spread: 180,
                    startVelocity: 60,
                    scalar: 1.2,
                    origin: { x: 0.5, y: 0.7 }
                });
            } else {
                for (let i = 0; i < 101; i++) {
                    setTimeout(() => {
                        const balloon = document.createElement("div");
                        balloon.classList.add("balloon");
                        balloon.style.left = Math.random() * 95 + "vw";
                        balloon.style.animationDuration = (Math.random() * 2 + 3.5) + "s";
                        document.body.appendChild(balloon);
                        
                        setTimeout(() => balloon.remove(), 6000);
                    }, i * 35);
                }
            }
        };

    } else {
        if (diffDays === 1) {
            bdayText.textContent = "1 day left until my birthday";
        } else {
            bdayText.textContent = diffDays + " days left until my birthday";
        }
        celebrateBtn.style.display = "none";
    }
}

// ==========================================================================
// 3.5. BACKGROUND CHANGER PAGE FUNCTION (forYou)
// ==========================================================================
function initForYouPage() {
    const imageInput = document.getElementById('imageInput');
    if (!imageInput) return; 

    const statusText = document.getElementById('statusText');
    const resultCanvas = document.getElementById('resultCanvas');
    const showResultBtn = document.getElementById('showResultBtn');
    const bgOptions = document.querySelectorAll('.bg-option');
    const ctx = resultCanvas.getContext('2d');

    const resultModal = document.getElementById('resultModal');
    const modalResultImage = document.getElementById('modalResultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const closeResultModal = document.getElementById('closeResultModal');

    let userImage = null;
    let noBgUserImage = null; 

    imageInput.addEventListener('change', (e) => {
        console.log("File successfully selected by the browser!");
        const file = e.target.files[0];
        if (!file) return;

        statusText.style.color = '#ffe066';
        statusText.textContent = 'Processing photo... Please wait.';
        noBgUserImage = null; 

        const reader = new FileReader();
        reader.onload = (event) => {
            userImage = new Image();
            userImage.onload = async () => {
                resultCanvas.width = userImage.width;
                resultCanvas.height = userImage.height;

                ctx.drawImage(userImage, 0, 0);

                try {
                    if (typeof window.imglyRemoveBackground !== 'undefined') {
                        const imageBlob = await window.imglyRemoveBackground(event.target.result);
                        
                        noBgUserImage = new Image();
                        noBgUserImage.onload = () => {
                            statusText.style.color = '#66ff66';
                            statusText.textContent = 'Photo ready! Now select a background below.';
                        };
                        noBgUserImage.src = URL.createObjectURL(imageBlob);
                    } else {
                        statusText.style.color = '#ff3333';
                        statusText.textContent = 'Error: Background removal library failed to load.';
                    }
                } catch (error) {
                    console.error("Background removal error:", error);
                    statusText.style.color = '#ff3333';
                    statusText.textContent = 'Failed to process photo. Please try another image.';
                }
            };
            userImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    bgOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (!userImage) {
                alert('Please upload your photo first!');
                return;
            }
            if (!noBgUserImage) {
                alert('Please wait for the image to finish processing.');
                return;
            }

            const bgName = option.getAttribute('data-bg');
            const bgImage = new Image();
            
            bgImage.onload = () => {
                ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

                let bgWidth = resultCanvas.width;
                let bgHeight = resultCanvas.height;
                let bgX = 0;
                let bgY = 0;

                const canvasRatio = resultCanvas.width / resultCanvas.height;
                const bgRatio = bgImage.width / bgImage.height;

                if (canvasRatio > bgRatio) {
                    bgHeight = resultCanvas.width / bgRatio;
                    bgY = (resultCanvas.height - bgHeight) / 2;
                } else {
                    bgWidth = resultCanvas.height * bgRatio;
                    bgX = (resultCanvas.width - bgWidth) / 2;
                }

                ctx.drawImage(bgImage, bgX, bgY, bgWidth, bgHeight);
                ctx.drawImage(noBgUserImage, 0, 0, resultCanvas.width, resultCanvas.height);

                statusText.textContent = 'Background applied successfully!';
                showResultBtn.style.display = 'inline-block'; 
            };

            bgImage.src = `/images/${bgName}.jpg`;
        });
    });

    if (showResultBtn) {
        showResultBtn.addEventListener('click', () => {
            const dataUrl = resultCanvas.toDataURL('image/jpeg');
            
            if (modalResultImage) {
                modalResultImage.src = dataUrl;
            }
            
            if (downloadBtn) {
                downloadBtn.href = dataUrl;
            }

            if (resultModal) {
                resultModal.style.display = 'flex';
            }
        });
    }

    if (closeResultModal) {
        closeResultModal.addEventListener('click', () => {
            if (resultModal) resultModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            if (resultModal) resultModal.style.display = 'none';
        }
    });
}

// ==========================================================================
// 4. RUN ALL INITIALIZATIONS
// ==========================================================================
checkBirthday();
initpage();
initForYouPage();