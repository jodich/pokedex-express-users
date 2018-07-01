var React = require("react");


class Navigation extends React.Component {
  render() {

    const newPoke = 

    ( <form className="form_style" method="GET" action="/pokemon/new">
        <input id="newPoke_btn" className="btn" type="submit" value="Create New Pokemon" />
      </form> );

    const sortBy = 

    ( <form className="form_style" method="GET" action="/">
        <input className="btn" type="submit" value="Sort By Name"/>
        <input type="hidden" name="sortby" value="name"/>
      </form> )

    const newUser = 

    ( <form className="form_style" method="GET" action="/user/new">
        <input id="newUser_btn" className="btn" type="submit" value="New User" />
      </form> );

    const login = 

    ( <form className="form_style" method="GET" action="/user/login">
        <input id="login_btn" className="btn" type="submit" value="Login" />
      </form> );

    const logout = 

    ( <form className="form_style" method="POST" action="/user/logout?_method=DELETE">
        <input id="logout_btn" className="btn" type="submit" value="Logout" />
      </form> );



    return (
      <div className="navigation">
        {newPoke} {sortBy} <div>{login} {logout}{newUser}</div>
      </div>










    );
  }
}

module.exports = Navigation;
