import React, {useState} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import defaultImage from '../../assets/imgs/custom.jpg';

const Avatar = ({name = '', source, size = 60, style}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(' ')
    .map(part => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <View
      style={[
        styles.container,
        {width: size, height: size, borderRadius: size / 2},
        style,
      ]}>
      {!imageLoaded || imageError ? (
        <View style={styles.fallbackContainer}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      ) : null}

      <Image
        source={source || defaultImage}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
        onLoad={() => setImageLoaded(true)}
        resizeMode="cover"
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            position: 'absolute',
            top: 0,
            left: 0,
          },
          imageLoaded && !imageError ? {} : {opacity: 0},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#AAA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  image: {},
});

export default Avatar;
