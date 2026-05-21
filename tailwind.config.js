/** @type {import('tailwindcss').Config} */
export default {
    content: ["./views/**/*.ejs", "./public/**/*.html"],
    theme: {
        extend: {
            colors: {
                primary: "#2563eb", // Màu xanh thương hiệu
            },
        },
    },
    plugins: [],
};
