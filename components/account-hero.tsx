import {useContext, useEffect, useState} from 'react';
import {BeproService} from "@services/bepro-service";
import {changeLoadState} from '@reducers/change-load-state';
import {ApplicationContext} from '@contexts/application';
import {changeMyIssuesState} from '@reducers/change-my-issues';
import {changeOraclesParse, changeOraclesState} from '@reducers/change-oracles';
import GithubHandle from './github-handle';
import { toNumber } from 'lodash';

export default function AccountHero() {
  const {dispatch, state: {beproInit, oracles, metaMaskWallet, currentAddress, balance, myIssues}} = useContext(ApplicationContext);

  function loadBeproNetworkInformation() {
    if (!beproInit || !metaMaskWallet || !currentAddress)
      return;

    const address = currentAddress;

    BeproService.network
                .getIssuesByAddress(address)
                .then(issuesList => {
                  dispatch(changeMyIssuesState(issuesList));
                })
                .then(_ => BeproService.network.getOraclesSummary({address}))
                .then(oracles => {
                  dispatch(changeOraclesState(changeOraclesParse(address, oracles)));
                })
                .catch(e => {
                  console.error(e);
                })
  }

  useEffect(loadBeproNetworkInformation, [beproInit, metaMaskWallet, currentAddress, oracles])

  return (
    <div className="banner bg-bepro-blue mb-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <h1 className="h2 mb-0">My account</h1>
                <GithubHandle />
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="top-border">
                    <h4 className="h4 mb-0">{myIssues.length || 0}</h4>
                    <span className="p-small">Issues</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="top-border">
                    <h4 className="h4 mb-0">{+oracles?.tokensLocked + +oracles?.oraclesDelegatedByOthers || 0}</h4>
                    <span className="p-small">Oracles</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="top-border">
                    <h4 className="h4 mb-0">
                      {oracles?.delegatedToOthers || 0}
                    </h4>
                    <span className="p-small">Delegated oracles</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="top-border">
                    <h4 className="h4 mb-0">
                      {+oracles?.oraclesDelegatedByOthers || 0}
                    </h4>
                    <span className="p-small">Delegated by Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
