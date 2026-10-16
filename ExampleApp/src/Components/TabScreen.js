// Global Imports
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Local Imports
import Colors from '../Helper/Colors';
import { RADIUS, SHADOW } from '../Helper/Theme';

// Components Imports
import Header from './Header';

// Screen with a header and a segmented tab switcher.
// `tabs` is [{ key, label, subtitle, component }]. Tabs mount on first visit and
// stay mounted afterwards so their state survives switching back and forth.
const TabScreen = ({ title, tabs, initialTab }) => {

  const [activeTab, setActiveTab] = useState(initialTab ?? tabs[0].key);
  const [visitedTabs, setVisitedTabs] = useState([activeTab]);

  // Follow tab changes requested through navigation params
  useEffect(() => {
    if (initialTab) handleSelectTab(initialTab);
  }, [initialTab]);

  const handleSelectTab = (key) => {
    setActiveTab(key);
    setVisitedTabs((visited) => (visited.includes(key) ? visited : [...visited, key]));
  };

  const activeInfo = tabs.find((tab) => tab.key === activeTab);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar backgroundColor={Colors.PAGE} barStyle='dark-content' />
      <Header title={title} subtitle={activeInfo?.subtitle} />
      <View style={styles.segmentedView}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity key={tab.key} activeOpacity={0.7} onPress={() => handleSelectTab(tab.key)}
              accessibilityRole='tab' accessibilityState={{ selected: isActive }}
              style={[styles.segmentView, isActive && styles.segmentActiveView]}>
              <Text style={[styles.segmentTxt, isActive && styles.segmentActiveTxt]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {tabs.map(({ key, component: TabComponent }) => (
        visitedTabs.includes(key) ? (
          <View key={key} style={[styles.tabContentView, key !== activeTab && styles.hiddenView]}>
            <TabComponent />
          </View>
        ) : null
      ))}
    </SafeAreaView>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE
  },
  segmentedView: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 4,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.BORDER
  },
  segmentView: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm
  },
  segmentActiveView: {
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  segmentTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY
  },
  segmentActiveTxt: {
    fontWeight: '700',
    color: Colors.INK
  },
  tabContentView: { flex: 1 },
  hiddenView: { display: 'none' }
});
