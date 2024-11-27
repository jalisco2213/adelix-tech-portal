<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from "@/ts/client/supabase";
import { editorSession } from "@/ts/client/state";
import ErrorMessage from '../components/reaction/ErrorMessage.vue';
import AcceptMessage from '../components/reaction/AcceptMessageMixin.vue';

const router = useRouter();
let errorMessage = ref('');
let email = ref('');
let password = ref('');
let ring = ref(false);
let loginForm = ref(true);
let acceptMessage = ref('');

async function getEmailByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users').select('email').eq('username', username).single();
    return data ? data.email : null;
  } catch (error) {
    console.error('Error fetching email by username:', error);
    return null;
  }
}

async function getLoggedInUser(userid) {
  try {
    const { data: playerData, error: playerError } = await supabase
      .from('users').select('*').eq('id', userid).single();

    if (playerError) {
      console.error('Error fetching user data:', playerError);
      return null;
    }

    return {
      ...playerData,
    };

  } catch (error) {
    console.error('Error fetching logged in user data:', error);
    return null;
  }
};

async function loginAccount() {
  ring.value = true;
  loginForm.value = false;

  const username = email.value;
  const foundEmail = await getEmailByUsername(username);

  if (!email.value || !password.value) {
    displayError('Заполните все поля.');
    return;
  }

  if (!foundEmail) {
    displayError('Аккаунт не найден');
    return;
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email: foundEmail,
    password: password.value,
  });

  if (error) {
    displayError('Неверно указан пароль.');
  } else {
    acceptMessage.value = 'Успешно';
    const userID = data?.user?.id;
    if (userID) {
      const loggedInUserData = await getLoggedInUser(userID);
      if (loggedInUserData) {
        editorSession.value = loggedInUserData;
        await router.push('/storage');
      } else {
        displayError('Ошибка при получении данных пользователя.');
      }
    }
  }
}

function displayError(message) {
  ring.value = false;
  loginForm.value = true;
  errorMessage.value = message;
  setTimeout(() => { errorMessage.value = '' }, 3000);
}
</script>

<template>
  <div class="login-container">
    <div class="lds-dual-ring" v-if="ring"></div>
    <div class="login-form" v-if="loginForm">
      <div class="logo-container">
        <img src="/adlLogo.png" alt="Logo" class="logo">
      </div>
      <h2 class="login-title">Добро пожаловать</h2>

      <hr class="divider" />

      <div class="input-container">
        <input type="text" @keydown.enter="loginAccount" v-model="email" class="input-field" placeholder="Логин"
          required>
      </div>

      <div class="input-container">
        <input type="password" @keydown.enter="loginAccount" v-model="password" class="input-field" placeholder="Пароль"
          required>
      </div>

      <div class="button-container">
        <button @click="loginAccount" class="action-button">
          <img src="/login.svg" alt="">Авторизоваться
        </button>
      </div>
    </div>
  </div>

  <AcceptMessage v-if="acceptMessage" :acceptMessage="acceptMessage" />
  <ErrorMessage v-if="errorMessage" :errorMessage="errorMessage" />
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #E8F0FE, #F9F9F9);
}

.login-form {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 360px;
  transition: .1s ease-in-out;

  &:hover {
    transition: .1s ease-in-out;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.logo {
  width: 80px;
  height: auto;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #4A4A4A;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 1px;
}

.divider {
  background: #CED4DA;
  height: 2px;
  border: none;
  margin: 15px 0;
}

.input-container {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.input-field {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #CED4DA;
  border-radius: 10px;
  font-size: 1rem;
  transition: border 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.03);
    box-shadow: 0 4px 15px rgba(0, 86, 179, 0.3);
  }
}

.lds-dual-ring {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 4px solid rgba(0, 123, 255, 0.5);
  border-radius: 50%;
  border-top-color: #007BFF;
  animation: lds-dual-ring 1s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .login-form {
    width: 90%;
    padding: 30px;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .input-field {
    font-size: 0.9rem;
  }

  .action-button {
    font-size: 0.9rem;
  }
}
</style>
