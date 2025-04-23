import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleRegister = () => {
    //Implement logic for register

    // Simple regex for email & phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
  
    // Check for empty fields
    if (!name || !birth || !gender || !phoneNumber || !email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
  
    // Validate phone number
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập số điện thoại đúng định dạng.');
      return;
    }
  
    // Validate email format
    if (!emailRegex.test(email)) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email.');
      return;
    }
  
    // Optional: check password length
    if (password.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
  
    // Passed all checks – simulate register success
    router.push('/screen/homepage');
  };
  

  const goToLogin = () => {
    router.push('/screen/login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.titleImage}
            resizeMode="contain"
          />
  
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>

              <Text style={styles.inputtitle}>Họ và tên</Text>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tên"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>
  
              <Text style={styles.inputtitle}>Ngày sinh</Text>
              <View style={styles.inputContainer}>
                <Icon name="calendar" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ngày sinh"
                  placeholderTextColor="#999"
                  value={birth}
                  onChangeText={setBirth}
                  keyboardType="numeric"
                />
              </View>
  
              <Text style={styles.inputtitle}>Giới tính</Text>
              <View style={styles.inputContainer}>
                <Icon name="venus-mars" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Giới tính"
                  placeholderTextColor="#999"
                  value={gender}
                  onChangeText={setGender}
                />
              </View>
  
              <Text style={styles.inputtitle}>Số điện thoại</Text>
              <View style={styles.inputContainer}>
                <Icon name="phone" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
  
              <Text style={styles.inputtitle}>Email</Text>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
  
              <Text style={styles.inputtitle}>Mật khẩu</Text>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#34A262" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
  
              {/* Button + login link should also scroll */}
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
              </TouchableOpacity>
  
              <View style={styles.signupRow}>
                <Text style={styles.normalText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={goToLogin}>
                  <Text style={styles.linkText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    
  },
  titleImage: {
    width: '65%',
    height: '15%',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginBottom: 20,
    borderRadius: 8,
  },
  inputtitle: {
    marginBottom: 5,
    color: '#333',
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#34A262',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  normalText: {
    color: '#333',
    fontSize: 14,
  },
  linkText: {
    color: '#34A262',
    fontSize: 14,
    textDecorationLine: 'underline',

  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  footerImage: {
    width: '100%',

    alignSelf: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  
});
