const createBtn = document.body.children[0]
let loading = false
createBtn.addEventListener("click", async () => {
  if (loading) return
  const tabId = (await getActiveTab() || {}).id
  if (!tabId) return
  loading = true
  createBtn.classList.add("active")
  createBtn.classList.add("loader")
  chrome.tabs.sendMessage(tabId, {
    action: "doCreate",
  }, (res) => {
    if (res.step === "success") {
      createBtn.classList.remove("active")
      createBtn.classList.remove("loader")
      const oriText = createBtn.innerText
      createBtn.innerText = res.message
      createBtn.classList.add("success")
      setTimeout(() => {
        createBtn.classList.remove("success")
        createBtn.style.opacity = 1
        createBtn.innerText = oriText
        loading = false
      }, 3000)
    } else if (res.step === "error") {
      createBtn.classList.remove("active")
      createBtn.classList.remove("loader")
      const oriText = createBtn.innerText
      createBtn.style.opacity = 0.6
      createBtn.innerText = res.message
      setTimeout(() => {
        createBtn.style.opacity = 1
        createBtn.innerText = oriText
        loading = false
      }, 3000)
    }
  })
})

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve((tabs || [])[0])
    })
  })
}
