var React = require("react");

class Login extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/user/login">
          LOGIN
            <div>
              email:<input name="email" type="text" />
            </div>
            <div>
              password:<input name="password" type="text" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Login;
