import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid, Alert, Image, Animated } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceWidget = ({ onCommandProcessed, isHidden = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const floatAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      const text = e.value[0];
      setTranscript(text);
      if (onCommandProcessed) onCommandProcessed(text);
    };

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, [onCommandProcessed]);

  const startListening = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone to accept voice commands.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Microphone permission is required.");
          return;
        }
      }
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  // Floating effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [floatAnim]);

  // Wave ripple effect
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      waveAnim.setValue(0);
    }
  }, [isListening, waveAnim]);

  // Hide/Show widget effect
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isHidden ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isHidden, opacityAnim]);

  const waveScale1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });
  const waveOpacity1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0]
  });

  const waveScale2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5]
  });
  const waveOpacity2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0]
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: floatAnim }], opacity: opacityAnim }]} pointerEvents={isHidden ? 'none' : 'auto'}>
      {/* Tooltip / Chat Bubble */}
      <View style={styles.bubbleContainer}>
        {transcript ? (
          <View style={styles.transcriptBubble}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : (
          <View style={styles.tooltipBubble}>
            <Text style={styles.tooltipText}>Hi!! I'm your Voice Assistant!</Text>
            <View style={styles.tooltipTail} />
          </View>
        )}
      </View>

      {/* Rings and Image */}
      <View style={styles.widgetWrapper}>
        <Animated.View style={[styles.ring, styles.ringOuter, { transform: [{ scale: isListening ? waveScale1 : 1 }], opacity: isListening ? waveOpacity1 : 0.15 }]} />
        <Animated.View style={[styles.ring, styles.ringInner, { transform: [{ scale: isListening ? waveScale2 : 1 }], opacity: isListening ? waveOpacity2 : 0.3 }]} />
        
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.listening]}
          onPress={isListening ? stopListening : startListening}
          activeOpacity={0.8}
        >
          <Image 
            source={require('../assets/chef.png')} 
            style={styles.chefImage} 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  bubbleContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  tooltipBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tooltipText: {
    color: '#ff5722',
    fontWeight: '700',
    fontSize: 14,
  },
  tooltipTail: {
    position: 'absolute',
    right: -6,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  transcriptBubble: {
    backgroundColor: 'rgba(255, 87, 34, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: 220,
  },
  transcriptText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  widgetWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 1,
  },
  ringOuter: {
    width: 86,
    height: 86,
    borderColor: '#ff5722',
    backgroundColor: 'transparent',
  },
  ringInner: {
    width: 74,
    height: 74,
    borderColor: '#ff5722',
    backgroundColor: 'transparent',
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  listening: {
    borderColor: '#ff5722',
    borderWidth: 2,
  },
  chefImage: {
    width: '100%',
    height: '100%',
  }
});

export default VoiceWidget;
