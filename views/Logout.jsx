var React = require("react");

class Logout extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/user/logout?_method=DELETE">
            <input type="submit" value="Logout?" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Logout;
