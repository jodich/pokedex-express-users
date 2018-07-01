/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
var sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');

// Initialise postgres client
const config = {
  user: 'jodich',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user !== 'jodich') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */


 /*

============== POKEMON STUFF ==============

*/

// app.get('/', getRoot);
const getRoot = (request, response) => {

  let queryString = '';

  if (request.query.sortby == "name") {

    queryString = "SELECT * FROM pokemon WHERE is_deleted='false' AND user_id = 0 ORDER BY name ASC";
  
  } else if (request.cookies['user_id'] == undefined) {

    // if not logged in, see all pokemon
    queryString = "SELECT * FROM pokemon WHERE is_deleted='false' AND user_id = 0 ORDER BY id ASC";

  } else {

    // if logged in, see user created pokemon only
    // option: can see all pokemons and user created pokemon by adding user_id=0
    // cannot remove user_id =" + userId as it will show all pokemons including pokemons not created by that user
    let userId = request.cookies['user_id'];
        
    // selects pokemon that user owns
    queryString = "SELECT pokemon.* FROM users INNER JOIN users_pokemon ON (users_pokemon.user_id = users.id) \
    INNER JOIN pokemon ON (users_pokemon.pokemon_id = pokemon.id)\
    WHERE users_pokemon.user_id =" + userId + " ORDER BY id";
  
  }

  // send query
  pool.query(queryString, (err, result) => {

    if (err) {
      console.error('Query error:', err.stack);
    } else {

      // redirect to home page
      response.render( 'home', {pokemon: result.rows} );
    }

  });
}

// app.get('/pokemon/new', getNew);
const getNew = (request, response) => {
  response.render('new');
}

// app.get('/pokemon/:id', getPokemon);
const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon', {pokemon: result.rows[0]} );
    }
  });
}

// app.post('/pokemon', postPokemon);
const postPokemon = (request, response) => {
  let params = request.body;

  params.weight += ' kg';
  params.height += ' m';

  let isDeleted = 'false';

  let userId = request.cookies['user_id'];

  if (userId == undefined) {
    response.send('Create account first!')

  } else {

    // insert into pokemon list
    const queryString = 'INSERT INTO pokemon(name, num, img, weight, height, is_deleted, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id;';
    const values = [params.name, params.num, params.img, params.weight, params.height, isDeleted, userId];

    pool.query(queryString, values, (err, result) => {
      if (err) {
        console.log('query error:', err.stack);
      } else {
        // console.log('query result:', result);
        // redirect to home page

        // insert user.id and pokemon.id into users_pokemon
        const queryString2 = 'INSERT INTO users_pokemon (user_id, pokemon_id) VALUES ($1, $2)'
        const values2 = [userId, result.rows[0].id];

        pool.query(queryString2, values2, (err, result2) => {

          response.redirect('/');
        })

      }
    });

  }
  
};

// app.get('/pokemon/:id/edit', editPokemonForm);
const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'edit', {pokemon: result.rows[0]} );
    }
  });
}

// app.put('/pokemon/:id', updatePokemon);
const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

// app.get('/pokemon/:id/delete', deletePokemonForm);
const deletePokemonForm = (request, response) => {
  // need to find the id
  // display the pokemon and form to delete

  let id = request.params['id'];

  const queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const values = [id];

  console.log(queryString);

  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.log('Query error:', err.stack);
    } else {
      console.log('Query error:', result);

      let poke = { pokemon: result.rows[0] }

      response.render('Delete', poke);
    }

  });


}

// app.delete('/pokemon/:id', deletePokemon);
const deletePokemon = (request, response) => {

  let id = request.params['id'];

  const queryString = "UPDATE pokemon SET is_deleted='true' WHERE id= $1";
  const values = [id];

  console.log(queryString);

  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.log('Query error:', err.stack);
    } else {
      console.log('Query error:', result);

      response.redirect('/')
    }

  })


}
/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

/*

============== USER STUFF ==============

*/

const getUser = (request, response) => {

  response.send('profile page?')
}

const getNewUser = (request, response) => {
  response.render('NewUser')
}

const postUser = (request, response) => {

  let newUser = request.body

  newUser.password = sha256(newUser.password)

  const queryString = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
  const values = [newUser.email, newUser.password];

  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.log('Query error:', err.stack);
    } else {
      console.log('Query error:', result);

      response.cookie('logged_in', 'true');
      response.cookie('user_id', result.rows[0].id);

      response.redirect('/user');
    }

  })

}

const getUserLogin = (request, response) => {

  response.render('UserLogin')

}


const postUserLogin = (request, response) => {

  let inputUser = request.body

  inputUser.password = sha256(inputUser.password)

  const queryString = 'SELECT * FROM users WHERE email= $1';
  const values = [inputUser.email];

  pool.query(queryString, values, (err, result) => {
    // check for error, if not error
    // check if email exist if exist
    // check password matches, if password match
    // redirect to user profile page

    if (err) {
      console.log('Query error:', err.stack);
    
    } else {

      if (result.rows[0] === undefined) {
        response.send('no such user')

      } else {

        if (inputUser.password === result.rows[0].password) {
          
          response.cookie('logged_in', 'true')
          response.cookie('user_id', result.rows[0].id)

          response.redirect('/user')

        } else {
          response.send('password wrong')
        }

      }

    }

  })

}

// const getUserLogout = (request, response) => {
//   response.render('Logout')
// }

const deleteUserLogin = (request, response) => {

  response.clearCookie('logged_in')
  response.clearCookie('user_id')

  response.redirect('/');

}

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/user', getUser)
app.get('/user/new', getNewUser)
app.get('/user/login', getUserLogin)
// app.get('/user/logout', getUserLogout)

app.post('/user', postUser)
app.post('/user/login', postUserLogin)

app.delete('/user/logout', deleteUserLogin)








/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


