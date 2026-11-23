const page = document.body.dataset.page || "home";
const config = window.AIMUP_FIREBASE_CONFIG || {};
const appConfig = window.AIMUP_APP_CONFIG || {};
const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

const menu = [
  { label: "AI 강연", href: "index.html#services", children: ["강연요청", "AI 무료특강"] },
  { label: "AI 콘텐츠", href: "index.html#services", children: ["AI 홍보포스터", "AI 홍보영상"] },
  { label: "AI 자동화", href: "index.html#services", children: ["업무 자동화"] },
  { label: "AI 리포트", href: "index.html#services", children: ["AI 활용 보고서"] },
  { label: "강사 아카데미", href: "index.html#services", children: ["AI 강사 양성"] }
];

function renderShell() {
  const headerRoot = document.querySelector("[data-site-header]");
  if (headerRoot && !["dashboard", "admin"].includes(page)) {
    const inner = page !== "home" ? "inner-header" : "";
    headerRoot.innerHTML = `<header class="site-header ${inner}">
      <a class="logo" href="index.html" aria-label="AIMUP 홈"><img src="logo.png" alt="AIMUP"></a>
      <nav class="main-nav" aria-label="주 메뉴">${menu.map(item => `<div class="nav-item"><a class="nav-link" href="${item.href}">${item.label}</a><div class="dropdown">${item.children.map(child => `<a href="index.html#contact" data-program="${child}">${child}</a>`).join("")}</div></div>`).join("")}</nav>
      <div class="header-actions"><a href="login.html">로그인</a><a class="join-link" href="signup.html">회원가입</a></div>
      <button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
    </header>`;
  }

  const footerRoot = document.querySelector("[data-site-footer]");
  if (footerRoot) footerRoot.innerHTML = `<footer class="site-footer"><div class="footer-top"><div class="footer-brand"><img src="logo.png" alt="AIMUP"><p>AI를 배우고, 가능성을 높이다.</p></div><div class="footer-links"><div><strong>CONTACT</strong><a href="mailto:gsnmw4@naver.com">gsnmw4@naver.com</a><a href="tel:+821093331879">010-9333-1879</a></div><div><strong>ADDRESS</strong><span>수원시 장안구 율전로</span><a href="index.html#contact">강연 요청하기</a></div><div><strong>ACCOUNT</strong><a href="login.html">로그인</a><a href="signup.html">회원가입</a><a href="admin.html">관리자</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} AIMUP. ALL RIGHTS RESERVED.</span><span>대표 남민우 · AI 전문교육</span></div></footer>`;
}

renderShell();

const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  document.querySelector(".menu-toggle")?.addEventListener("click", event => {
    const open = header.classList.toggle("mobile-open");
    document.body.classList.toggle("menu-open", open);
    event.currentTarget.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll("[data-program]").forEach(link => link.addEventListener("click", () => {
  sessionStorage.setItem("aimup_program", link.dataset.program);
}));

const preset = sessionStorage.getItem("aimup_program");
if (preset) {
  const select = document.querySelector('[name="program"]');
  if (select && [...select.options].some(option => option.value === preset)) select.value = preset;
  sessionStorage.removeItem("aimup_program");
}

const courseTabs = [...document.querySelectorAll("[data-course-tab]")];
const coursePanels = [...document.querySelectorAll("[data-course-panel]")];
const courseTabStrip = document.querySelector(".course-tabs");
const courseAccordion = document.querySelector(".course-panels");
const courseDescriptions = {
  intro: "AI의 핵심 원리부터 안전한 업무 활용까지",
  content: "홍보포스터와 숏폼 영상 제작 실습",
  automation: "반복 업무를 줄이는 AI 워크플로 설계",
  report: "리서치·초안·시각화로 완성하는 보고서",
  instructor: "강의 기획부터 시범 강의까지 단계별 완성"
};

if (courseTabStrip && courseAccordion && courseTabs.length === coursePanels.length) {
  courseAccordion.classList.add("course-accordion-list");
  courseAccordion.setAttribute("aria-label", "AIMUP 과정별 커리큘럼");
  courseTabs.forEach((tab, index) => {
    const course = tab.dataset.courseTab;
    const panel = coursePanels.find(item => item.dataset.coursePanel === course);
    const label = tab.textContent.trim();
    const item = document.createElement("section");
    item.className = `course-accordion-item${index === 0 ? " active" : ""}`;
    item.dataset.courseItem = course;

    tab.className = "course-accordion-trigger";
    tab.removeAttribute("role");
    tab.removeAttribute("aria-selected");
    tab.setAttribute("aria-expanded", String(index === 0));
    tab.tabIndex = 0;
    tab.innerHTML = `<span class="accordion-index">${String(index + 1).padStart(2, "0")}</span><span class="accordion-title"><strong>${label}</strong><small>${courseDescriptions[course]}</small></span><span class="accordion-mark" aria-hidden="true"></span>`;

    panel.hidden = index !== 0;
    panel.classList.toggle("active", index === 0);
    item.append(tab, panel);
    courseAccordion.append(item);
  });
  courseTabStrip.remove();
}

function selectCourse(course) {
  const target = courseTabs.find(tab => tab.dataset.courseTab === course);
  const shouldOpen = target?.getAttribute("aria-expanded") !== "true";
  courseTabs.forEach(tab => {
    const open = tab.dataset.courseTab === course && shouldOpen;
    tab.setAttribute("aria-expanded", String(open));
    tab.closest(".course-accordion-item")?.classList.toggle("active", open);
  });
  coursePanels.forEach(panel => {
    const open = panel.dataset.coursePanel === course && shouldOpen;
    panel.classList.toggle("active", open);
    panel.hidden = !open;
  });
}

courseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCourse(tab.dataset.courseTab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = event.key === "Home" ? 0 : event.key === "End" ? courseTabs.length - 1 : index + (event.key === "ArrowDown" ? 1 : -1);
    next = (next + courseTabs.length) % courseTabs.length;
    courseTabs[next].focus();
  });
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

class AuthService {
  constructor() { this.mode = "demo"; this.auth = null; this.db = null; this.sdk = null; }
  async init() {
    if (!isFirebaseConfigured) return this;
    try {
      const [{ initializeApp }, authSdk, storeSdk] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js")
      ]);
      const firebaseApp = initializeApp(config);
      this.auth = authSdk.getAuth(firebaseApp); this.db = storeSdk.getFirestore(firebaseApp);
      this.sdk = { ...authSdk, ...storeSdk }; this.mode = "firebase";
    } catch (error) { console.warn("Firebase 연결 실패, 데모 모드로 전환합니다.", error); }
    return this;
  }
  getDemoUser() { try { return JSON.parse(localStorage.getItem("aimup_user")); } catch { return null; } }
  async currentUser() {
    if (this.mode === "demo") return this.getDemoUser();
    return new Promise(resolve => this.sdk.onAuthStateChanged(this.auth, async user => {
      if (!user) return resolve(null);
      const token = await user.getIdTokenResult();
      resolve({ uid:user.uid, email:user.email, name:user.displayName || user.email.split("@")[0], admin:Boolean(token.claims.admin) });
    }, () => resolve(null)));
  }
  async login(email, password) {
    if (this.mode === "firebase") {
      const result = await this.sdk.signInWithEmailAndPassword(this.auth, email, password);
      const token = await result.user.getIdTokenResult();
      return { uid:result.user.uid, email, name:result.user.displayName || email.split("@")[0], admin:Boolean(token.claims.admin) };
    }
    const user = { uid:`demo-${Date.now()}`, email, name:email.split("@")[0], admin:email.toLowerCase() === appConfig.ownerEmail?.toLowerCase() };
    localStorage.setItem("aimup_user", JSON.stringify(user)); return user;
  }
  async signup(name, email, password) {
    if (this.mode === "firebase") {
      const result = await this.sdk.createUserWithEmailAndPassword(this.auth, email, password);
      await this.sdk.updateProfile(result.user, { displayName:name });
      await this.sdk.setDoc(this.sdk.doc(this.db,"users",result.user.uid), { name,email,role:"member",createdAt:this.sdk.serverTimestamp() });
      return { uid:result.user.uid,email,name,admin:false };
    }
    const user = { uid:`demo-${Date.now()}`,email,name,admin:false };
    localStorage.setItem("aimup_user", JSON.stringify(user)); return user;
  }
  async logout() { if (this.mode === "firebase") await this.sdk.signOut(this.auth); localStorage.removeItem("aimup_user"); }
  async saveInquiry(data) {
    if (this.mode === "firebase") return this.sdk.addDoc(this.sdk.collection(this.db,"inquiries"), { ...data,status:"new",createdAt:this.sdk.serverTimestamp() });
    const list = JSON.parse(localStorage.getItem("aimup_inquiries") || "[]");
    list.unshift({ id:`local-${Date.now()}`, ...data,status:"new",createdAt:new Date().toISOString() });
    localStorage.setItem("aimup_inquiries", JSON.stringify(list)); return list[0];
  }
  async inquiries() {
    if (this.mode === "firebase") {
      const q = this.sdk.query(this.sdk.collection(this.db,"inquiries"),this.sdk.orderBy("createdAt","desc"),this.sdk.limit(50));
      const snap = await this.sdk.getDocs(q); return snap.docs.map(doc => ({id:doc.id,...doc.data()}));
    }
    return JSON.parse(localStorage.getItem("aimup_inquiries") || "[]");
  }
}

const auth = await new AuthService().init();
const friendlyError = error => ({
  "auth/invalid-credential":"이메일 또는 비밀번호를 확인해 주세요.",
  "auth/email-already-in-use":"이미 가입된 이메일입니다.",
  "auth/weak-password":"비밀번호는 6자 이상이어야 합니다.",
  "auth/invalid-email":"올바른 이메일 주소를 입력해 주세요."
}[error?.code] || "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");

document.querySelectorAll("[data-auth-form]").forEach(form => form.addEventListener("submit", async event => {
  event.preventDefault(); const button = form.querySelector("button"); const status = form.querySelector(".form-status");
  button.disabled = true; button.textContent = "처리 중..."; status.textContent = ""; status.classList.remove("error");
  try {
    const data = new FormData(form); let user;
    if (form.dataset.authForm === "login") user = await auth.login(data.get("email"),data.get("password"));
    else user = await auth.signup(data.get("name"),data.get("email"),data.get("password"));
    location.href = user.admin ? "admin.html" : "dashboard.html";
  } catch (error) { status.textContent = friendlyError(error); status.classList.add("error"); button.disabled = false; button.textContent = form.dataset.authForm === "login" ? "로그인" : "회원가입"; }
}));

document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", async () => { await auth.logout(); location.href="index.html"; }));

document.querySelector("[data-inquiry-form]")?.addEventListener("submit", async event => {
  event.preventDefault(); const form=event.currentTarget; const button=form.querySelector("button"); const status=form.querySelector(".form-status");
  button.disabled=true; button.textContent="전송 중...";
  try { const data=Object.fromEntries(new FormData(form)); await auth.saveInquiry(data); form.reset(); status.textContent="문의가 접수되었습니다. 확인 후 연락드리겠습니다."; button.textContent="접수 완료"; setTimeout(()=>{button.disabled=false;button.textContent="강연 문의 보내기"},2200); }
  catch(error){ status.textContent="문의 저장에 실패했습니다. 이메일 또는 전화로 연락해 주세요."; status.classList.add("error"); button.disabled=false;button.textContent="강연 문의 보내기"; }
});

async function initProtectedPages() {
  if (!["dashboard","admin"].includes(page)) return;
  const user = await auth.currentUser();
  if (!user) { location.replace("login.html"); return; }
  if (page === "admin" && !user.admin) { location.replace("dashboard.html"); return; }
  document.querySelector("[data-user-name]")?.replaceChildren(document.createTextNode(user.name || "회원"));
  const inquiries = await auth.inquiries().catch(()=>[]);
  document.querySelector("[data-request-count]")?.replaceChildren(document.createTextNode(String(inquiries.length).padStart(2,"0")));
  document.querySelector("[data-admin-request-count]")?.replaceChildren(document.createTextNode(String(inquiries.length).padStart(2,"0")));
  const table = document.querySelector("[data-inquiry-table]");
  if (table) table.innerHTML = inquiries.length ? inquiries.map(item => `<tr><td>${escapeHtml(item.name || "-")}</td><td>${escapeHtml(item.program || "-")}</td><td>${escapeHtml(item.contact || "-")}</td><td><span class="status-pill">신규</span></td><td>${formatDate(item.createdAt)}</td></tr>`).join("") : '<tr><td colspan="5" class="empty-cell">아직 등록된 문의가 없습니다.</td></tr>';
}

function escapeHtml(value){ const div=document.createElement("div");div.textContent=value;return div.innerHTML; }
function formatDate(value){ const date=value?.toDate?value.toDate():new Date(value);return Number.isNaN(date.getTime())?"-":new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium"}).format(date); }
await initProtectedPages();
