import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Cookies } from 'react-cookie'
import Notifications from 'react-notification-system-redux';
import { PROGRAMMS } from '../../config/config'

import Header from '../components/app/header'
import Footer from '../components/app/footer'
import Lock from './lock'
import { flashMessage, setDaoAddress, setLanguage, updateBalance } from '../../modules/app/actions';
import { load as loadCore } from '../../modules/dao/actions';

import './style.css'

// @translate(['view', 'nav'], { wait: true })
class App extends Component {
  componentWillMount() {
    this.props.updateBalance()
    const cookies = new Cookies();
    let address = cookies.get('dao_address')
    if (!address) {
      address = PROGRAMMS[0].address;
    }
    this.props.setDaoAddress(address)
    if (!this.props.isCoreLoad) {
      this.props.loadCore(address);
    }
    const language = cookies.get('language')
    if (language) {
      this.props.setLanguage(language)
    }
  }

  componentWillReceiveProps(next) {
    if (this.props.dao_address !== '' && this.props.dao_address !== next.dao_address) {
      this.props.loadCore(next.dao_address);
    }
  }

  render() {
    let content
    if (this.props.lockApp) {
      content = <Lock />
    } else {
      content = this.props.children
    }
    const style = {
      Containers: {
        DefaultStyle: {
          width: '530px',
        }
      },
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 2px 1px'
        },
      }
    };
    return (<div>
      <Header
        title={this.props.title}
        dao_address={this.props.dao_address}
        role={this.props.role}
        language={this.props.language}
        setLanguage={this.props.setLanguage}
        programms={this.props.programms}
        setDaoAddress={this.props.setDaoAddress}
      />
      <div className="container" id="maincontainer">
        {content}
      </div>
      <Footer />
      <Notifications
        notifications={this.props.notifications}
        style={style}
        allowHTML
      />
    </div>)
  }
}

function mapStateToProps(state, props) {
  return {
    title: state.app.title,
    dao_address: state.app.dao_address,
    role: state.app.role,
    language: state.app.language,
    lockApp: state.app.lockApp,
    isCoreLoad: (props.location.pathname === '/') ? false : state.dao.load,
    programms: PROGRAMMS,
    notifications: state.notifications,
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    flashMessage,
    setDaoAddress,
    setLanguage,
    loadCore,
    updateBalance
  }, dispatch)
  return {
    flashMessage: actions.flashMessage,
    setDaoAddress: actions.setDaoAddress,
    setLanguage: actions.setLanguage,
    loadCore: actions.loadCore,
    updateBalance: actions.updateBalance
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
