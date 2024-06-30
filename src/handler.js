/*
 * File         : handler.js
 * Project      : bookshelf-api-fwaskito
 * Author       : F. Waskito
 * ----------------------------------------------
 * Created Date : 'Tue, Jun 25th 2024' 9:30:54 AM
 * Last Modified: 'Tue, Jun 25th 2024' 9:09:10 PM
 */


const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * KRITERIA 3 [HANDLER]
 * API dapat menyimpan sebuah buku.
 */
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    const isValidData = name && readPage <= pageCount;

    if (!isValidData) {
        let message = null;
        if (!name) {
            message = 'Gagal menambahkan buku. Mohon isi nama buku';
        } else if (readPage > pageCount) {
            message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
        }

        const response = h.response({
            status: 'fail',
            message: message,
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        }
    });
    response.code(201);
    return response;
}

/**
 * KRITERIA 4 [HANDLER]
 * API dapat menampilkan seluruh buku, serta memungkinkan filtering buku
 * setelahnya berdasarkan query parameter request berupa:
 * - reading
 *   (=1/0: 1 untuk reading == true, 0 untuk reading == false);
 * - finished
 *   (=1/0: 1 untuk finished == true, 0 untuk finished == false); atau
 * - name
 *   (=substring: untuk name includes substring).
 */
const getAllBooksHandler = (request) => {
    const { reading, finished, name } = request.query;

    if (!reading && !finished && !name) {
        data = {
            'books': books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        };
    } else if (reading) {
        if (reading == 1) {
            readingBooks = books.filter((book) => book.reading);
            data = {
                'books':  readingBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        } else {
            unreadingBooks = books.filter((book) => !book.reading);
            data = {
                'books': unreadingBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        }
    } else if (finished) {
        finishedBooks = books.filter((book) => book.finished);
        if (finished == 1) {
            data = {
                'books':  finishedBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        } else {
            unfinishedBooks = books.filter((book) => !book.finished);
            data = {
                'books': unfinishedBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        }
    } else if (name) {
        specifiedNameBooks = books.filter((book) => {
            return book.name.toLowerCase().includes(name.toLowerCase());
        });
        data = {
            'books': specifiedNameBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        }
    }

    return {
        status: 'success',
        data: data,
    }
};

/**
 * KRITERIA 5 [HANDLER]
 * API dapat menampilkan detail sebuah buku berdasarkan atribut id-nya
 * melalui route.
 */
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((book) => book.id === bookId)[0];

    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

/**
 * KRITERIA 6 [HANDLER]
 * API dapat mengubah data sebuah buku berdasarkan atribut id-nya melalui
 * route.
 */
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    const isValidData = name && (readPage <= pageCount) && index !== -1;

    if (!isValidData) {
        let status_code = 400;
        let message = null;

        if (!name) {
            message = 'Gagal memperbarui buku. Mohon isi nama buku';
        } else if (readPage > pageCount) {
            message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
        } else {
            status_code = 404;
            message = 'Gagal memperbarui buku. Id tidak ditemukan'
        }

        const response = h.response({
            status: 'fail',
            message: message,
        });
        response.code(status_code);
        return response;
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

/**
 * KRITERIA 7 [HANDLER]
 * API data menghapus sebuah buku berdasarkan atribut id-nya melalui route.
 */
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index < 0) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
          });
          response.code(404);
          return response;
    }

    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
