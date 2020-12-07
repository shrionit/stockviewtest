import React from 'react';
import { Footer, Row } from 'rsuite';
import { Text, Anchor, Box, Clock } from 'grommet';

const footerStyle = {
    position: 'fixed', // cast string to type 'absolute'
    bottom: 0,
    textAlign: 'center'
} as React.CSSProperties;

export default class AppFooter extends React.Component {
    public render() {
        return (
            <Footer style={footerStyle}>
                <Box pad="medium">
                    <Row>
                        <Text>@ Copyright</Text>
                    </Row>
                </Box>
            </Footer>
        );
    }
}
