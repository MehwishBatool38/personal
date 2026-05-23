import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/animation.dart';
import '../../providers/auth_provider.dart';
import 'login_screen.dart';
import '../../widgets/animated_button.dart';

class SignupScreen extends StatefulWidget {
  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen>
    with SingleTickerProviderStateMixin {

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _termsAccepted = false;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 600),
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeIn,
      ),
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _animationController.forward();
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final size = MediaQuery.of(context).size;

    // Define colors with null safety
    final primaryColor = Colors.blue[700]!;
    final primaryColorDark = Colors.blue[900]!;
    final grey600 = Colors.grey[600]!;
    final grey50 = Colors.grey[50]!;
    final blue50 = Colors.blue[50]!;
    final red50 = Colors.red[50]!;
    final red200 = Colors.red[200]!;
    final red700 = Colors.red[700]!;

    return Scaffold(
      backgroundColor: grey50,
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          child: Container(
            height: size.height,
            child: Stack(
              children: [
                // Background Design
                Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                    width: 150,
                    height: 150,
                    decoration: BoxDecoration(
                      color: blue50,
                      borderRadius: BorderRadius.only(
                        bottomRight: Radius.circular(100),
                      ),
                    ),
                  ),
                ),

                // Main Content
                Padding(
                  padding: EdgeInsets.all(20),
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _fadeAnimation.value,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 60),

                            // Back button
                            IconButton(
                              onPressed: () => Navigator.pop(context),
                              icon: Icon(Icons.arrow_back_ios, size: 20),
                              color: primaryColor,
                            ),

                            SizedBox(height: 20),

                            // Title
                            Text(
                              'Create Account',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: primaryColorDark,
                              ),
                            ),

                            SizedBox(height: 5),

                            Text(
                              'Sign up to start using Smart POS',
                              style: TextStyle(
                                fontSize: 16,
                                color: grey600,
                              ),
                            ),

                            SizedBox(height: 40),

                            // Error Message
                            if (authProvider.errorMessage != null)
                              Container(
                                padding: EdgeInsets.all(12),
                                margin: EdgeInsets.only(bottom: 20),
                                decoration: BoxDecoration(
                                  color: red50,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: red200),
                                ),
                                child: Row(
                                  children: [
                                    Icon(Icons.error_outline, color: Colors.red),
                                    SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        authProvider.errorMessage!,
                                        style: TextStyle(color: red700),
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.close, size: 18),
                                      onPressed: () => authProvider.clearError(),
                                    ),
                                  ],
                                ),
                              ),

                            // Signup Form
                            Form(
                              key: _formKey,
                              child: Column(
                                children: [
                                  // Name Field
                                  TextFormField(
                                    controller: _nameController,
                                    decoration: InputDecoration(
                                      labelText: 'Full Name',
                                      prefixIcon: Icon(Icons.person_outline),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(15),
                                        borderSide: BorderSide.none,
                                      ),
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 15,
                                        horizontal: 20,
                                      ),
                                    ),
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter your name';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 20),

                                  // Email Field
                                  TextFormField(
                                    controller: _emailController,
                                    decoration: InputDecoration(
                                      labelText: 'Email Address',
                                      prefixIcon: Icon(Icons.email_outlined),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(15),
                                        borderSide: BorderSide.none,
                                      ),
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 15,
                                        horizontal: 20,
                                      ),
                                    ),
                                    keyboardType: TextInputType.emailAddress,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter your email';
                                      }
                                      if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                        return 'Please enter a valid email';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 20),

                                  // Password Field
                                  TextFormField(
                                    controller: _passwordController,
                                    decoration: InputDecoration(
                                      labelText: 'Password',
                                      prefixIcon: Icon(Icons.lock_outline),
                                      suffixIcon: IconButton(
                                        icon: Icon(
                                          _passwordVisible
                                              ? Icons.visibility_outlined
                                              : Icons.visibility_off_outlined,
                                          color: grey600,
                                        ),
                                        onPressed: () {
                                          setState(() {
                                            _passwordVisible = !_passwordVisible;
                                          });
                                        },
                                      ),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(15),
                                        borderSide: BorderSide.none,
                                      ),
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 15,
                                        horizontal: 20,
                                      ),
                                    ),
                                    obscureText: !_passwordVisible,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter a password';
                                      }
                                      if (value.length < 6) {
                                        return 'Password must be at least 6 characters';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 20),

                                  // Confirm Password Field
                                  TextFormField(
                                    controller: _confirmPasswordController,
                                    decoration: InputDecoration(
                                      labelText: 'Confirm Password',
                                      prefixIcon: Icon(Icons.lock_outline),
                                      suffixIcon: IconButton(
                                        icon: Icon(
                                          _confirmPasswordVisible
                                              ? Icons.visibility_outlined
                                              : Icons.visibility_off_outlined,
                                          color: grey600,
                                        ),
                                        onPressed: () {
                                          setState(() {
                                            _confirmPasswordVisible = !_confirmPasswordVisible;
                                          });
                                        },
                                      ),
                                      filled: true,
                                      fillColor: Colors.white,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(15),
                                        borderSide: BorderSide.none,
                                      ),
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 15,
                                        horizontal: 20,
                                      ),
                                    ),
                                    obscureText: !_confirmPasswordVisible,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please confirm your password';
                                      }
                                      if (value != _passwordController.text) {
                                        return 'Passwords do not match';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 30),

                                  // Terms Checkbox
                                  Row(
                                    children: [
                                      Checkbox(
                                        value: _termsAccepted,
                                        onChanged: (value) {
                                          setState(() {
                                            _termsAccepted = value ?? false;
                                          });
                                        },
                                        activeColor: primaryColor,
                                      ),
                                      Expanded(
                                        child: Text.rich(
                                          TextSpan(
                                            children: [
                                              TextSpan(
                                                text: 'I agree to the ',
                                                style: TextStyle(color: grey600),
                                              ),
                                              TextSpan(
                                                text: 'Terms of Service',
                                                style: TextStyle(
                                                  color: primaryColor,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              TextSpan(
                                                text: ' and ',
                                                style: TextStyle(color: grey600),
                                              ),
                                              TextSpan(
                                                text: 'Privacy Policy',
                                                style: TextStyle(
                                                  color: primaryColor,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  SizedBox(height: 30),

                                  // Sign Up Button
                                  AnimatedButton(
                                    onPressed: authProvider.isLoading || !_termsAccepted
                                        ? null
                                        : () async {
                                      if (_formKey.currentState!.validate()) {
                                        // First, sign up with email and password
                                        bool success = await authProvider.signUpWithEmail(
                                          _emailController.text.trim(),
                                          _passwordController.text,
                                        );

                                        if (success && context.mounted) {
                                          // After successful signup, you can save the user's name
                                          // to your database or update their profile
                                          // For example:
                                          // await authProvider.updateUserName(_nameController.text.trim());

                                          Navigator.pushReplacementNamed(
                                            context,
                                            '/dashboard',
                                          );
                                        }
                                      }
                                    },
                                    isLoading: authProvider.isLoading,
                                    text: 'Create Account',
                                    icon: Icons.person_add,
                                  ),

                                  SizedBox(height: 30),

                                  // Already have account link
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        "Already have an account? ",
                                        style: TextStyle(color: grey600),
                                      ),
                                      GestureDetector(
                                        onTap: () {
                                          Navigator.pushReplacement(
                                            context,
                                            PageRouteBuilder(
                                              pageBuilder: (_, __, ___) => LoginScreen(),
                                              transitionsBuilder: (_, animation, __, child) {
                                                return SlideTransition(
                                                  position: Tween<Offset>(
                                                    begin: Offset(-1, 0),
                                                    end: Offset.zero,
                                                  ).animate(animation),
                                                  child: child,
                                                );
                                              },
                                            ),
                                          );
                                        },
                                        child: Text(
                                          'Sign In',
                                          style: TextStyle(
                                            color: primaryColor,
                                            fontWeight: FontWeight.bold,
                                            decoration: TextDecoration.underline,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  SizedBox(height: 20),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}