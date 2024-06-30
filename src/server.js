/*
 * File         : server.js
 * Project      : bookshelf-api-fwaskito
 * Author       : F. Waskito
 * ----------------------------------------------
 * Created Date : 'Tue, Jun 25th 2024' 9:25:07 AM
 * Last Modified: 'Tue, Jun 25th 2024' 8:28:54 PM
 */


const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,               // KRITERIA 1: Aplikasi menggunakan port 9000
    host: 'localhost',
    // routes: {
    //   cors: {
    //     origin: ['*'],
    //   },
    // },
  });

  server.route(routes);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
