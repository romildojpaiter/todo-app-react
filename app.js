//import liraries
import  React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, ListView, Keyboard, AsyncStorage } from 'react-native';

// import pages
import Footer from './footer';
import Header from './header';
import Row from './row';

// const
const filterItems = (filter, items) => {
    return items.filter((item) => {
        if (filter === "ALL") return true;
        if (filter === "ACTIVE") return !item.complete;
        if (filter === "COMPLETED") return item.complete;
    })
}

// create a component
class App extends Component {

    constructor(props) {
        super(props);
        const ds =  new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            loading: true,
            allComplete: false,
            filter: "ALL",
            value: "",
            items: [],
            dataSource: ds.cloneWithRows([])
        };

        // Binding
        this.handleUpdateText = this.handleUpdateText.bind(this);
        this.handleToggleEditing = this.handleToggleEditing.bind(this);
        this.setSource = this.setSource.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleClearComplete = this.handleClearComplete.bind(this);
    }

    componentWillMount() {
      AsyncStorage.getItem("items").then((json) => {
        try {
          const items = JSON.parse(json);
          this.setSource(items, items, {loading: false});
        } catch (e) {
          this.setState({
            loading: false
          })
        }
      })
    }

    handleUpdateText(key, text) {
      const newsItems = this.state.items.map((item) => {
        if (item.key !== key) return item;
        return {
          ... item,
          text
        }
      })
      console.log("handleUpdateText");
      this.setSource(newsItems, filterItems(this.state.filter, newsItems));
    }

    handleToggleEditing(key, editing) {
      const newsItems = this.state.items.map((item) => {
        if (item.key !== key) return item;
        return {
          ... item,
          editing
        }
      })
      console.log("handleToggleEditing")
      this.setSource(newsItems, filterItems(this.state.filter, newsItems));
    }

    handleFilter(filter) {
        this.setSource(this.state.items, filterItems(filter, this.state.items), { filter });
    }

    handleClearComplete() {
      const newsItems = filterItems("ACTIVE", this.state.items);
      this.setSource(newsItems, filterItems(this.state.filter, newsItems));
    }

    handleRemoveItem(key) {
        console.log(key);
        const newsItems = this.state.items.filter((item) => {
            return item.key !== key
        })
        this.setSource(newsItems, filterItems(this.state.filter, newsItems));
    }

    setSource(items, itemsDatasource, otherState = {}) {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
            ... otherState
        })
        AsyncStorage.setItem("items", JSON.stringify(items));
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
        return this.setSource(newsItems, filterItems(this.state.filter, newsItems));
    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newsItems = this.state.items.map( (item) => ({
            ... item,
            complete
         }));
         console.table(newsItems);
         this.setSource(newsItems, filterItems(this.state.filter, newsItems), { allComplete: complete })
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
                                    onUpdate={(text) => this.handleUpdateText(key, text)}
                                    onToogleEdit={(editing) => this.handleToggleEditing(key, editing)}
                                    onRemove={() => this.handleRemoveItem(key)}
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
                <Footer
                  count={filterItems("ACTIVE", this.state.items).length}
                  onFilter={this.handleFilter}
                  filter={this.state.filter}
                  onClearComplete={this.handleClearComplete}
                />
              {this.state.loading && <View style={styles.loading}>
                <ActivityIndicator
                  animating
                  size="large"
                  />
              </View>}
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
    loading: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,.2)"
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
