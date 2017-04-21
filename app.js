//import liraries
import  React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ListView, Keyboard } from 'react-native';

// import pages
import Footer from './footer';
import Header from './header';
import Row from './row';

// create a component
class App extends Component {

    constructor(props) {
        super(props);
        const ds =  new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            allComplete: false,
            value: "",
            items: [],
            dataSource: ds.cloneWithRows([])
        };

        // Binding
        this.setSource = this.setSource.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    }

    setSource(items, itemsDatasource, otherState = {}) {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
            ... otherState
        })
    }

    handleToggleComplete(key, complete) {
        const newsItems = this.state.items.map((item) => {
            if (item.key !== key) return item;
            return {
                ... item,
                complete
            }
        })
        console.table(newsItems);
        return this.setSource(newsItems, newsItems);
    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newsItems = this.state.items.map( (item) => ({
            ... item,
            complete
         }));
         console.table(newsItems);
         this.setSource(newsItems, newsItems, { allComplete: complete })
        //  this.setState({
        //      items: newsItems,
        //      allComplete: complete
        //  })
    }

    handleAddItem() {
        if(!this.state.value) return;
        const newsItems = [
            ... this.state.items,
            {
                key: Date.now(),
                text: this.state.value,
                complete: false
            }
        ]
        console.log(newsItems)
        this.setSource(newsItems, newsItems, { value: "" })
        // this.setState({
        //     items: newsItems,
        //     value: ""
        // })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    value={this.state.value}
                    onAddItem={this.handleAddItem}
                    onChange={(value) => this.setState({value})}
                    onToggleAllComplete={this.handleToggleAllComplete}
                />
                <View style={styles.content}>
                    <ListView
                        style={styles.list}
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        onScroll={() => Keyboard.dismiss()}
                        renderRow={({key, ...value}) => {
                            return (
                                <Row
                                    key={key}
                                    onComplete={(complete) => this.handleToggleComplete(key, complete)}
                                    { ... value}
                                />
                            )
                        }}
                        renderSeparator={(sectionId, rowId) => {
                            return <View key={rowId} style={styles.separator} />
                        }}
                    />
                </View>
                <Footer />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        ... Platform.select({
            ios: { 
                paddingTop: 30
            },
            android: {}
        })
    },
    content: {
        flex: 1
    },
    list: {
        backgroundColor: '#FFF'
    },
    separator: {
        borderWidth: 1,
        borderColor: '#F5F5F5'
    }
});

//make this component available to the App
export default App;
