import React, { Component } from 'react'
import { FlexboxGrid, Icon, List, Loader, Panel, Table } from 'rsuite';
import api from './../api';
const { Column, HeaderCell, Cell } = Table;

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

export default class Home extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            stockList: [],
        }
        this.updateStocklist = this.updateStocklist.bind(this);
        this.renderRaise = this.renderRaise.bind(this);
    }
    componentDidMount() {
        this.updateStocklist();
    }
    renderRaise(number) {
        const isPositive = number > 0;
        const isNegative = number < 0;
        return (
            <span
                style={{
                    paddingLeft: 15,
                    color: isNegative ? 'red' : 'green'
                }}
            >
                <span>{isPositive ? '+' : null}</span>
                <span>{number}</span>
            </span>
        );
    }
    updateStocklist() {
        api.get('/stock').then(d => d.data).then(d => {
            this.setState({ stockList: d, loading: false, });
        });
    }

    render() {
        return (
            <div>
                <Panel shaded bodyFill style={{ margin: '0 20px', padding: '10px' }}>
                    <h4>Popular Stocks</h4>
                    {
                        this.state.stockList.length == 0
                            ? (<Loader backdrop content="loading..." vertical />)
                            : (
                                <List hover>{
                                    this.state.stockList.map((item: any, index: any) => {
                                        return <List.Item key={item.id} index={index}>
                                            <FlexboxGrid justify="space-between" style={{ margin: '0 10px' }}>
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


                                                <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={slimText}>Top Value</div>
                                                        <div style={dataStyle}>{item.closePrice}</div>
                                                    </div>
                                                    {this.renderRaise(item.rate)}
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </List.Item>
                                    })}
                                </List>
                            )
                    }
                </Panel>
            </div>
        )
    }
}
