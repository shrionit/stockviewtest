import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { AutoComplete, Icon, InputGroup, Panel, Row, Col, IconButton, FlexboxGrid, List, Loader } from 'rsuite';
import api from '../api';
import firebase, { auth } from '../firebase';

const styles = {
    width: "80%",
    margin: '2% 10%'
};

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
};

const slimText: any = {
    fontSize: '0.666em',
    color: '#97969B',
    fontWeight: 'lighter',
    paddingBottom: '5'
};

const titleStyle: any = {
    paddingBottom: '5',
    fontWeight: '500'
};

const dataStyle: any = {
    fontSize: '1.2em',
    fontWeight: '500'
};

const SearchBar = ({ searchData, currentWatchList, addWatchlist, removeWatchlist, renderRaise, ...props }) => (
    <div style={{ width: '100%' }}>
        <InputGroup inside style={styles}>
            <AutoComplete placeholder="Search Stocks" renderItem={(item: any) => {
                return (
                    <List style={{ width: '900px' }}>
                        <FlexboxGrid justify="space-between" align="middle">
                            <FlexboxGrid.Item
                                colspan={6}
                                style={{
                                    ...styleCenter,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={titleStyle}>{item.label}</div>
                                <div style={slimText}>
                                    <div>{renderRaise(item.rate)}</div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                <div style={{ textAlign: 'right' }}>
                                    {currentWatchList.filter(e => e.id == item.id).length == 0 ? <IconButton color="green" icon={<Icon icon="plus-circle" />} onClick={() => addWatchlist(item.id)} /> : <IconButton icon={<Icon icon="close-circle" />} color="red" onClick={() => removeWatchlist(item.id)} />}
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List>
                );
            }} data={searchData} />
            <InputGroup.Button>
                <Icon icon="search" />
            </InputGroup.Button>
        </InputGroup>
    </div>
);


export default class Watchlist extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            redirect: false,
            searchData: [],
            currentUserWatchList: [],
        }
        this.updateSearchlist = this.updateSearchlist.bind(this);
        this.addToWatchList = this.addToWatchList.bind(this);
        this.getWatchList = this.getWatchList.bind(this);
        this.removeFromWatchList = this.removeFromWatchList.bind(this);
        this.renderRaise = this.renderRaise.bind(this);
    }

    unsubscribeFromAuth: any = null;

    componentDidMount() {
        this.unsubscribeFromAuth = auth.onAuthStateChanged((user: any) => {
            if (user) {
                this.setState({ currentUser: user, redirect: false });
                this.getWatchList(user);
                this.updateSearchlist();
            } else {
                console.log("No User");
                this.setState({ redirect: true });
            }
        }, err => console.log(err));
    }

    getWatchList(user) {
        this.setState({ currentUserWatchList: [] });
        api.get("/watchlist/view", {
            params: {
                user: user.providerData[0],
            }
        }).then(d => d.data).then(d => {
            d.watchlist.forEach(e => {
                api.get('stock/' + e)
                    .then(d => d.data)
                    .then(d => this.state.currentUserWatchList.push(d));
            });
        });
    }

    renderRaise(number) {
        const isPositive = number > 0;
        const isNegative = number < 0;
        return (
            <span
                style={{
                    paddingLeft: 15,
                    color: isNegative ? 'yellow' : 'green'
                }}
            >
                <span>{isPositive ? '+' : null}</span>
                <span>{number}</span>
            </span>
        );
    }

    addToWatchList(stock) {
        if (this.state.currentUser) {
            api.post('watchlist/add', { user: this.state.currentUser.providerData[0], stockid: stock })
                .then(d => d.data)
                .then(d => {
                    this.setState({ currentUserWatchList: this.state.currentUserWatchList.concat(this.state.searchData.filter(e => e.id == stock)) });
                });
        }
    }

    updateSearchlist() {
        api.get('/stock').then(d => d.data).then(d => {
            this.setState({ searchData: d });
        });
    }

    removeFromWatchList(stock) {
        api.delete('watchlist/remove', { data: { user: this.state.currentUser.providerData[0], stockid: stock } })
            .then(d => d.data)
            .then(d => {
                console.log(d);
                this.setState({ currentUserWatchList: this.state.currentUserWatchList.filter(e => e.id != stock) });
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        } else {
            return (
                <Panel header="My Watchlist" style={{ minHeight: '400px', margin: '0 10%' }} bordered>
                    <Panel shaded>
                        <SearchBar searchData={this.state.searchData} currentWatchList={this.state.currentUserWatchList} renderRaise={this.renderRaise} removeWatchlist={this.removeFromWatchList} addWatchlist={this.addToWatchList} />
                    </Panel>
                    <Panel bodyFill>
                        {
                            this.state.currentUserWatchList.length == 0
                                ? (<Loader content="loading..." vertical center />)
                                : (
                                    <List hover>
                                        {this.state.currentUserWatchList.map((item, index) => (
                                            <List.Item key={item.id} index={index}>
                                                <FlexboxGrid justify="space-between">
                                                    {/*base info*/}
                                                    <FlexboxGrid.Item
                                                        colspan={6}
                                                        style={{
                                                            ...styleCenter,
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        <div style={titleStyle}>{item.label}</div>
                                                    </FlexboxGrid.Item>
                                                    {/*peak data*/}
                                                    <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={slimText}>Top Value</div>
                                                            <div style={dataStyle}>{item.closePrice}</div>
                                                        </div>
                                                        {this.renderRaise(item.rate)}
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <IconButton icon={<Icon icon="close-circle" onClick={() => this.removeFromWatchList(item.id)} />} />
                                                        </div>
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>
                                            </List.Item>
                                        ))}
                                    </List>
                                )

                        }
                    </Panel>
                </Panel>
            );
        }
    }
}
