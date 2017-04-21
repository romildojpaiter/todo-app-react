//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

// create a component
class Row extends Component {

    render() {
        
        const { complete } = this.props;

        return (
            <View style={styles.container}>
                <Switch value={complete}
                        onValueChange={this.props.onComplete} />
                <View style={styles.textWrap}>
                    <Text>{complete}</Text>
                    <Text style={[styles.texts, complete && styles.complete]}>{this.props.text}</Text>
                </View>
                <TouchableOpacity onPress={this.props.onRemove}>
                    <Text style={styles.destroy}>X</Text>
                </TouchableOpacity>                   
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: "space-between"
    },
    textWrap: {
        flex: 1,
        marginHorizontal: 10
    },
    complete: {
        textDecorationLine: "line-through"
    },
    texts: {
        fontSize: 20,
        color: '#4d4d4d'
    },
    destroy: {
        fontSize: 20,
        color: '#cc9a9a'
    }
});

//make this component available to the app
export default Row;
