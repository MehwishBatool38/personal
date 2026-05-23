import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  User? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isLoggedIn => _currentUser != null;

  // Constructor - initialize current user
  AuthProvider() {
    _currentUser = _auth.currentUser;
    _auth.authStateChanges().listen((User? user) {
      _currentUser = user;
      notifyListeners();
    });
  }

  // Sign in with email and password
  Future<bool> signInWithEmail(String email, String password) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      UserCredential credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _currentUser = credential.user;
      _setLoading(false);
      return true;
    } on FirebaseAuthException catch (e) {
      _errorMessage = _getErrorMessage(e.code);
      _setLoading(false);
      return false;
    }
  }

  // Sign up with email and password
  Future<bool> signUpWithEmail(String email, String password) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      UserCredential credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      _currentUser = credential.user;
      _setLoading(false);
      return true;
    } on FirebaseAuthException catch (e) {
      _errorMessage = _getErrorMessage(e.code);
      _setLoading(false);
      return false;
    }
  }

  // Sign in with Google
  Future<bool> signInWithGoogle() async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        _setLoading(false);
        return false;
      }

      final GoogleSignInAuthentication googleAuth =
      await googleUser.authentication;

      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      UserCredential userCredential =
      await _auth.signInWithCredential(credential);
      _currentUser = userCredential.user;
      _setLoading(false);
      return true;
    } catch (e) {
      _errorMessage = 'Google sign in failed: $e';
      _setLoading(false);
      return false;
    }
  }

  // Sign out
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await _auth.signOut();
      _currentUser = null;
      notifyListeners();
    } catch (e) {
      print('Error signing out: $e');
    }
  }

  // Password reset
  Future<void> resetPassword(String email) async {
    _setLoading(true);
    try {
      await _auth.sendPasswordResetEmail(email: email);
      _setLoading(false);
    } catch (e) {
      _errorMessage = 'Failed to send reset email: $e';
      _setLoading(false);
      rethrow;
    }
  }

  // Clear error message
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  String _getErrorMessage(String errorCode) {
    switch (errorCode) {
      case 'user-not-found':
        return 'No user found with this email';
      case 'wrong-password':
        return 'Incorrect password';
      case 'invalid-email':
        return 'Invalid email address';
      case 'user-disabled':
        return 'This account has been disabled';
      case 'email-already-in-use':
        return 'An account already exists with this email';
      case 'weak-password':
        return 'Password is too weak';
      case 'operation-not-allowed':
        return 'Email/password sign-in is not enabled';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}