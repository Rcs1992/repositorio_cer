import { db, auth } from './firebase.js';
import {
  ref,
  set,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addPlantaoBtn = document.getElementById("addPlantaoBtn");

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const userName = document.getElementById("userName");

const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const gestorControls = document.getElementById("gestorControls");

let currentUser = null;

loginBtn.onclick = () => {
  signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value)
    .then(userCredential => {
      currentUser = userCredential.user;
    }).catch(err => alert("Erro: " + err.message));
};

logoutBtn.onclick = () => {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    userName.innerText = user.email;

    if (user.email.includes("gestor")) {
      gestorControls.classList.remove("hidden");
    }

    renderCalendar();
  } else {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
  }
});

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement("div");
    calendar.appendChild(div);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayBox = document.createElement("div");
    dayBox.className = "border p-2 min-h-[80px] text-sm relative";

    const title = document.createElement("strong");
    title.innerText = day;
    dayBox.appendChild(title);

    const refDay = ref(db, `escala/${dateStr}`);
    onValue(refDay, snapshot => {
      dayBox.querySelectorAll(".plantonista").forEach(e => e.remove());
      dayBox.querySelectorAll("button").forEach(e => e.remove());

      const data = snapshot.val();
      let isMyShift = false;

      if (data) {
        Object.entries(data).forEach(([id, email]) => {
          const p = document.createElement("div");
          p.className = "plantonista text-green-700";
          p.innerText = email;
          dayBox.appendChild(p);

          if (email === currentUser.email) {
            isMyShift = true;
          }
        });
      }

      if (isMyShift && !currentUser.email.includes("gestor")) {
        const btn = document.createElement("button");
        btn.className = "bg-yellow-400 text-white px-2 py-1 mt-2 rounded text-xs";
        btn.innerText = "Solicitar troca";
        btn.onclick = () => solicitarTroca(dateStr);
        dayBox.appendChild(btn);
      }
    });

    calendar.appendChild(dayBox);
  }
}

addPlantaoBtn.onclick = () => {
  const data = document.getElementById("plantaoData").value;
  const nome = document.getElementById("plantonistaNome").value;
  if (!data || !nome) return alert("Preencha os campos");

  const diaRef = ref(db, `escala/${data}`);
  push(diaRef, nome);
};

function solicitarTroca(data) {
  const trocaRef = ref(db, `solicitacoes`);
  const nova = {
    data,
    plantonista: currentUser.email,
    status: "pendente"
  };
  push(trocaRef, nova);
  alert(`Solicitação enviada para o plantão de ${data}`);
}