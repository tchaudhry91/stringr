import { StyleSheet } from 'react-native';

export const SharedStyles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  // Typography
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },

  tabSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginHorizontal: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    opacity: 0.7,
  },

  value: {
    fontSize: 18,
    marginTop: 5,
  },

  // Form elements
  form: {
    gap: 16,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  destructiveButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  destructiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },

  // Layout elements
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});