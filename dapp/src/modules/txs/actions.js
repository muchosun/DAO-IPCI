import axios from 'axios'
import _ from 'lodash'
import hett from 'hett'
import { ADD, LOAD } from './actionTypes'

export function add(tx) {
  return {
    type: ADD,
    payload: tx
  }
}

export function load() {
  return (dispatch, getState) => {
    const state = getState();
    const registry = {};
    const agents = {};
    if (!_.isEmpty(state.dao.address)) {
      _.set(registry, state.dao.address, state.dao.name);
    }
    _.forEach(state.dao.blocks, (item) => {
      _.forEach(item.modules, (module) => {
        if (item.type !== 'agents') {
          _.set(registry, module.address, module.name);
        } else {
          _.set(agents, module.address, module.name);
        }
      });
    });
    const count = _.keys(registry).length
    if (count > 0) {
      dispatch({
        type: LOAD,
        payload: true
      })
      let i = 0;
      _.forEach(registry, (name, address) => {
        axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=asc&apikey=M1KX26NG5RF9P7R27XETQEB31IPAYUPVMS')
          .then((result) => {
            _.forEach(result.data.result, (tx) => {
              dispatch(add(
                {
                  txId: tx.hash,
                  from: tx.from,
                  fromName: (_.has(agents, tx.from)) ? agents[tx.from] : '',
                  to: tx.to,
                  toName: name,
                  timestamp: tx.timeStamp,
                  input: tx.input,
                  ascii: hett.web3.toAscii(tx.input),
                }
              ))
            });
            i += 1;
            if (i >= count) {
              dispatch({
                type: LOAD,
                payload: false
              })
            }
          })
          .catch((e) => {
            console.log(e);
          })
      });
    }
  }
}
