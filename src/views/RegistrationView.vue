<script setup>
import { supabase } from '../ts/client/supabase';
import { createClient } from '@supabase/supabase-js';
import { ref } from 'vue';
import Navigation from '../components/Navigation.vue';
import Greetings from '../components/Greetings/Greetings.vue';

const username = ref('');
const email = ref('');
const password = ref('');

const transliterate = (str) => {
  const translitMap = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'shch', ы: 'y', э: 'e', ю: 'yu', я: 'ya'
  };
  return str.split('').map(char => translitMap[char.toLowerCase()] || char).join('');
};

const register = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPAURL;
  const supabaseKey = import.meta.env.VITE_SUPAKEY;

  const supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });

  const emailPrefix = transliterate(username.value).toLowerCase().replace(/\s+/g, '');
  email.value = `${emailPrefix}@adelix.com`;

  const { data: authData, error: authError } = await supabaseClient.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (authData) {
    const { data, error } = await supabase
      .from('users')
      .upsert([
        {
          id: authData.user.id,
          username: username.value,
          role: 'Пользователь',
          email: email.value,
          tgid: '-',
          avatar: '/user.png'
        },
      ]);

    Swal.fire({
      title: 'Успех!',
      text: 'Пользователь успешно зарегистрирован!',
      icon: 'success',
      confirmButtonText: 'Ок',
    });
  } else if (authError) {
    Swal.fire({
      title: 'Ошибка!',
      text: authError.message,
      icon: 'error',
      confirmButtonText: 'Попробовать снова',
    });
  }
};
</script>

<template>
  <div class="wrapper">
    <Navigation />
    <div class="container">
      <Greetings />
      <div class="registration">
        <h1>Регистрация</h1>
        <form @submit.prevent="register">
          <input v-model="username" type="text" placeholder="Имя и фамилия" required />
          <input style="display: none;" v-model="email" type="email" placeholder="Email" required readonly />
          <input v-model="password" type="text" placeholder="Пароль" required />
          <button type="submit">Зарегистрировать</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.registration {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

input {
  width: 94%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
