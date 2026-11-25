# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Integrasi Backend

Frontend menggunakan `http://127.0.0.1:8000/api` sebagai URL API bawaan. Untuk backend di alamat lain, atur `REACT_APP_API_BASE_URL` (contoh: `http://127.0.0.1:8000/api`) sebelum menjalankan atau membangun aplikasi.

Alur pasien yang terhubung mencakup registrasi dan login JWT, profil pasien, pembuatan serta konfirmasi janji temu, riwayat rekam medis, dan daftar/detail tagihan. Request terautentikasi mengirim token sebagai `Authorization: Bearer <token>`.

Alur dokter mencakup jadwal, antrean/status kunjungan, SOAP, resep, dan riwayat per pasien. Alur apoteker mencakup inventaris obat/batch, penerbitan dan detail tagihan, pembayaran, dan riwayat transaksi. Halaman admin terhubung ke antrean, audit log, jadwal dokter, inventaris, dan billing.

Pendaftaran staf tidak ditampilkan dalam form registrasi pasien. Admin memiliki halaman khusus di `/admin/registrasi-staf`, yang dilindungi role admin. Form pendaftaran di halaman tersebut dinonaktifkan karena backend belum menyediakan endpoint pembuatan akun dokter/apoteker yang memvalidasi token admin. Endpoint dokter yang masih menggunakan secret bukan endpoint admin, sedangkan `/register` hanya menerima role `patient`.

API yang terdokumentasi belum menyediakan daftar resep masuk atau operasi restock batch untuk obat yang sudah ada. Penerbitan billing memerlukan ID appointment secara manual karena kontrak tidak menyediakan endpoint daftar appointment selesai untuk apoteker/kasir. Antrean pada UI dokter menyaring hasil berdasarkan ID profil dokter.

Pastikan endpoint pendaftaran staf berikutnya hanya dapat digunakan dengan token admin dan memvalidasi role di backend, bukan hanya mengandalkan route guard frontend.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
