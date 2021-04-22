const mysql = require('mysql');
//connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_pass,
    database: process.env.DB_NAME
});
//view users
exports.view = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        //use the connection
        connection.query('SELECT * FROM users WHERE status="active" ', (err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows,removedUser });
            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};
//find user by search
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        let searchTerm = req.body.search;
        console.log(searchTerm)

        //use the connection
        connection.query('SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            //when done with the connection,release
            connection.release();
            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};
//render adduser
exports.form = (req, res) => {
    res.render('add-user');
}

//add user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        // let searchTerm= req.body.search;
        //console.log(searchTerm)

        //use the connection
        connection.query('INSERT INTO users SET first_name=?,last_name=?,email=?,phone=?,comments=?', [first_name, last_name, email, phone, comments], (err, rows) => {
            //when done with the connection,release
            connection.release();
            if (!err) {
                res.render('add-user', { alert: 'New user added successfully..' });
            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};

//edit user-data
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        //use the connection
        connection.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {

                res.render('edit-user', { rows });

            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};


//update user-data
exports.update = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        //use the connection
        connection.query('UPDATE users SET first_name=?,last_name=?,email=?,phone=?,comments=? WHERE id=?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {
                pool.getConnection((err, connection) => {
                    if (err) throw err;  //not connected
                    console.log(`connected to db as id ${connection.threadId}`)

                    //use the connection
                    connection.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, rows) => {
                        //when done with the connection,release it
                        connection.release();
                        if (!err) {

                            res.render('edit-user', { rows, alert: `${first_name} has been updated` });

                        } else {
                            console.log(err);
                        }
                        console.log('Data from user table: \n', rows);
                    })
                });

            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};

//delete user-data
exports.delete = (req, res) => {
    //     pool.getConnection((err, connection) => {
    //         if (err) throw err;  //not connected
    //         console.log(`connected to db as id ${connection.threadId}`)

    //         //use the connection
    //         connection.query('DELETE FROM users WHERE id=?', [req.params.id], (err, rows) => {
    //             //when done with the connection,release it
    //             connection.release();
    //             if (!err) {

    //               res.redirect('/');

    //             } else {
    //                 console.log(err);
    //             }
    //             console.log('Data from user table: \n', rows);
    //         })
    //     });
    // };

    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        //use the connection
        connection.query('Update users SET status=? WHERE id=?', ['removed', req.params.id], (err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('user successfully removed.');

                res.redirect('/?removed='+removedUser);

            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};
exports.viewall = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;  //not connected
        console.log(`connected to db as id ${connection.threadId}`)

        //use the connection
        connection.query('SELECT * FROM users WHERE id=?',[req.params.id] ,(err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {
                res.render('view-user', { rows });
            } else {
                console.log(err);
            }
            console.log('Data from user table: \n', rows);
        })
    });
};
