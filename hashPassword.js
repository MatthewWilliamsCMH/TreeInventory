import argon2 from 'argon2';

const password = '100O Ur1:n';
const hash = await argon2.hash(password);
console.log(hash);
