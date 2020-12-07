import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Container, Content, Header, Nav, Navbar, Icon, Button, IconButton, Avatar, Dropdown } from 'rsuite';
import { createBrowserHistory } from 'history';
import firebase, { signInWithGoogle, auth } from './firebase';
import AppFooter from './components/Footer';
import Home from './components/Home';
import Watchlist from './components/Watchlist';
import { Component } from 'react';
import api from './api';
import { Text } from 'grommet';

const contentStyle = {
  minHeight: '100%',
  marginTop: '40px',
  overflow: 'auto',
}

const containerStyle = {
  minHeight: '90vh',
}

const CustomNav = ({ active, onSelect, logoutHandler, user, ...props }) => {
  return (
    <>
      <Navbar>
        <Navbar.Body>
          <Nav {...props} activeKey={active} onSelect={onSelect}>
            <Link to="/"><Nav.Item eventKey="home" icon={<Icon icon="home" />}>Home</Nav.Item></Link>
            <Link to="/watchlist"><Nav.Item disabled={!user} eventKey="watchlist">Watchlist</Nav.Item></Link>
          </Nav>
          <Nav pullRight>
            {
              user ?
                <Dropdown renderTitle={() => {
                  return (
                    <Button appearance="link" className="avatar">
                      <Avatar src={user.photoURL} alt="udp" />
                    </Button>
                  );
                }}>
                  <Dropdown.Item onSelect={logoutHandler}>Logout</Dropdown.Item>
                </Dropdown>
                :
                <IconButton className="signinBtn" onClick={signInWithGoogle} icon={<Icon icon="google" />} color="blue" placement="left">Sign In</IconButton>
            }
          </Nav>
        </Navbar.Body>
      </Navbar>
    </>
  );
};

class App extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      activeKey: "1",
      currentUser: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  unsubscribeFromAuth: any = null;

  handleSelect(eventKey: any) {
    this.setState({
      activeKey: eventKey
    });
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        console.log("No User");
      }
    }, err => console.log(err));
  }

  onLogout() {
    firebase.auth().signOut().then(() => this.setState({ currentUser: null })).catch(e => console.log(e));
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const history = createBrowserHistory();
    return (
      <Container className="App">
        <Router history={history}>
          <Header>
            <CustomNav logoutHandler={this.onLogout} onSelect={this.handleSelect} user={this.state.currentUser} active={this.state.activeKey} />
          </Header>
          <Container style={containerStyle}>
            <Content style={contentStyle}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/watchlist" component={Watchlist} />
              </Switch>
            </Content>
          </Container>
          <AppFooter />
        </Router>
      </Container>
    );
  }
}

export default App;
