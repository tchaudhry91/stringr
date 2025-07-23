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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
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
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    // Theme colors and borders will be handled by the Themed View component
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  listItemHeader: {
    marginBottom: 8,
  },

  listItemTitleRow: {
    marginBottom: 6,
  },

  listItemButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    // borderTopColor will be set dynamically in components
  },

  listItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    lineHeight: 24,
    // Text color will be handled by the Themed Text component
  },

  listItemSubtitle: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    opacity: 0.8,
  },

  listItemDetails: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    opacity: 0.8,
  },

  listItemNotes: {
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.7,
  },

  // Text buttons in list items
  textButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },

  deleteButtonText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '500',
  },

  stringButtonText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500',
  },

  playButtonText: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '500',
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