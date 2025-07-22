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

  // List styles
  list: {
    flex: 1,
  },

  listItem: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },

  listItemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },

  listItemNotes: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Buttons in list items
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },

  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Empty states
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },

  // Form styles (for modals)
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },

  cancelButton: {
    backgroundColor: '#f0f0f0',
  },

  saveButton: {
    backgroundColor: '#007AFF',
  },

  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },

  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  formContent: {
    padding: 16,
  },

  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});