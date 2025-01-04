import React, { useState, useCallback, useEffect } from 'react';
import {
    Page,
    Layout,
    Card,
    FormLayout,
    RangeSlider,
    Box,
    Select,
    TextField,
    ColorPicker,
    Button,
    Text,
    ButtonGroup,
    Icon,
    Frame,
    Toast,
    Checkbox,
    Grid
} from '@shopify/polaris';
import {
    TextBoldIcon,
    TextItalicIcon,
    TextUnderlineIcon
} from '@shopify/polaris-icons';
import NotificationPreview from '../components/NotificationPreview';

function formatTime(timestamp, format) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    switch(format) {
        case 'relative':
            if (diffInMinutes < 1) return 'just now';
            if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
            const hours = Math.floor(diffInMinutes / 60);
            if (hours < 24) return `${hours} hours ago`;
            return `${Math.floor(hours / 24)} days ago`;
            
        case 'short':
            if (diffInMinutes < 1) return 'now';
            if (diffInMinutes < 60) return `${diffInMinutes}m`;
            if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
            return `${Math.floor(diffInMinutes / 1440)}d`;
            
        case 'exact':
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
        case 'full':
            return date.toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                day: 'numeric'
            });
            
        default:
            return 'Invalid format';
    }
}

function SettingsPage() {
    const [settings, setSettings] = useState({
        timing: {
            interval: 15000,
            displayDuration: 5000,
            animationDuration: 500
        },
        display: {
            showImage: true,
            showTimeAgo: true,
            showPrice: true,
            maxWidth: '400px',
            position: 'bottom-left',
            imageSize: '50px',
            imageShape: 'rounded',
            imageBorder: true,
            allowClose: true,
            popupShape: 'rounded'
        },
        style: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            backgroundColor: { hue: 120, brightness: 1, saturation: 0, alpha: 1 },
            textColor: { hue: 0, brightness: 0, saturation: 0, alpha: 1 },
            borderRadius: '8px',
            shadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        text: {
            template: '{customer} from {location} just purchased {product}',
            timeAgoFormat: 'relative'
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to load settings');
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error('Error loading settings:', error);
                // Could show an error toast here
            }
        }
        loadSettings();
    }, []);

    const handleIntervalChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            timing: {
                ...prev.timing,
                interval: value * 1000
            }
        }));
    }, []);

    const handleDurationChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            timing: {
                ...prev.timing,
                displayDuration: value * 1000
            }
        }));
    }, []);

    const handleBackgroundColorChange = useCallback((color) => {
        setSettings(prev => ({
            ...prev,
            style: {
                ...prev.style,
                backgroundColor: color
            }
        }));
    }, []);

    const handleTextColorChange = useCallback((color) => {
        setSettings(prev => ({
            ...prev,
            style: {
                ...prev.style,
                textColor: color
            }
        }));
    }, []);

    const handleTemplateChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            text: {
                ...prev.text,
                template: value
            }
        }));
    }, []);

    const handlePositionChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                position: value
            }
        }));
    }, []);

    const handleMaxWidthChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                maxWidth: `${value}px`
            }
        }));
    }, []);

    const handleFontFamilyChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            style: {
                ...prev.style,
                fontFamily: value
            }
        }));
    }, []);

    const handleFontSizeChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            style: {
                ...prev.style,
                fontSize: `${value}px`
            }
        }));
    }, []);

    const handleShowImageChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                showImage: value
            }
        }));
    }, []);

    const handleImageShapeChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                imageShape: value
            }
        }));
    }, []);

    const handleImageSizeChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                imageSize: `${value}px`
            }
        }));
    }, []);

    const handleTimeAgoFormatChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            text: {
                ...prev.text,
                timeAgoFormat: value
            }
        }));
    }, []);

    const handleAllowCloseChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                allowClose: value
            }
        }));
    }, []);

    const handlePopupShapeChange = useCallback((value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                popupShape: value
            }
        }));
    }, []);

    const insertFormatting = useCallback((syntax) => {
        const field = document.querySelector('textarea[name="template"]');
        if (!field) return;

        const start = field.selectionStart;
        const end = field.selectionEnd;
        const text = settings.text.template;
        const selectedText = text.substring(start, end);

        // Helper to check if text has specific formatting
        const hasFormatting = (str, format) => {
            const formatCount = (str.match(new RegExp(`\\${format}`, 'g')) || []).length;
            return formatCount >= 2 && str.startsWith(format) && str.endsWith(format);
        };

        // Helper to remove specific formatting while preserving others
        const removeFormatting = (str, format) => {
            if (hasFormatting(str, format)) {
                // Remove only the outer-most formatting markers
                return str.slice(format.length, -format.length);
            }
            return str;
        };

        // Helper to add formatting while preserving others
        const addFormatting = (str, format) => {
            // Check if the string already has this formatting
            if (hasFormatting(str, format)) {
                return str; // Don't add if it already exists
            }
            return `${format}${str}${format}`;
        };

        let newText;
        if (start === end) {
            // No selection, insert placeholder
            newText = text.substring(0, start) + 
                     `${syntax}text${syntax}` + 
                     text.substring(end);
        } else {
            let processedText = selectedText;
            
            // Toggle formatting
            if (hasFormatting(processedText, syntax)) {
                processedText = removeFormatting(processedText, syntax);
            } else {
                processedText = addFormatting(processedText, syntax);
            }

            newText = text.substring(0, start) + 
                     processedText + 
                     text.substring(end);
        }

        handleTemplateChange(newText);
    }, [settings.text.template, handleTemplateChange]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            // Validate settings before sending
            console.log('Attempting to save settings:', settings);

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || 'Failed to save settings');
            }

            setToastMessage('Settings saved successfully');
            setToastError(false);
        } catch (error) {
            console.error('Detailed save error:', {
                message: error.message,
                stack: error.stack
            });
            setToastMessage(`Failed to save settings: ${error.message}`);
            setToastError(true);
        } finally {
            setIsSaving(false);
            setToastActive(true);
        }
    }, [settings]);

    const toggleToast = useCallback(() => setToastActive((active) => !active), []);

    return (
        <Frame>
            <Page 
                title="Social Proof Settings"
                primaryAction={{
                    content: 'Save',
                    onAction: handleSave,
                    loading: isSaving
                }}
            >
                <Layout>
                    <NotificationPreview settings={settings} />

                    <div style={{ height: '16px' }} />

                    <Layout.Section>
                        <Card>
                            <Box padding="4">
                                <Text variant="headingMd" as="h2">Content Settings</Text>
                                <Box paddingBlockStart="4">
                                    <FormLayout>
                                        <TextField
                                            label={
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text>Message Template</Text>
                                                    <div style={{ marginLeft: '16px' }}>
                                                        <ButtonGroup segmented>
                                                            <Button
                                                                icon={<Icon source={TextBoldIcon} />}
                                                                onClick={() => insertFormatting('*')}
                                                                size="micro"
                                                            />
                                                            <Button
                                                                icon={<Icon source={TextItalicIcon} />}
                                                                onClick={() => insertFormatting('_')}
                                                                size="micro"
                                                            />
                                                            <Button
                                                                icon={<Icon source={TextUnderlineIcon} />}
                                                                onClick={() => insertFormatting('~')}
                                                                size="micro"
                                                            />
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            }
                                            value={settings.text.template}
                                            onChange={handleTemplateChange}
                                            multiline={3}
                                            name="template"
                                            helpText={
                                                <span>
                                                    Available variables: {'{customer}'}, {'{location}'}, {'{product}'}, {'{price}'}
                                                </span>
                                            }
                                        />
                                        <Select
                                            label="Time Format"
                                            options={[
                                                { label: 'Relative (2 minutes ago)', value: 'relative' },
                                                { label: 'Short Relative (2m)', value: 'short' },
                                                { label: 'Exact Time (14:30)', value: 'exact' },
                                                { label: 'Time & Date (14:30, Jan 2)', value: 'full' }
                                            ]}
                                            value={settings.text.timeAgoFormat}
                                            onChange={handleTimeAgoFormatChange}
                                            helpText="How to display when the purchase happened"
                                        />
                                    </FormLayout>
                                </Box>
                            </Box>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <Box padding="4">
                                <Text variant="headingMd" as="h2">Display Settings</Text>
                                <Box paddingBlockStart="4">
                                    <FormLayout>
                                        <Select
                                            label="Position"
                                            options={[
                                                {label: 'Bottom Left', value: 'bottom-left'},
                                                {label: 'Bottom Right', value: 'bottom-right'},
                                                {label: 'Top Left', value: 'top-left'},
                                                {label: 'Top Right', value: 'top-right'}
                                            ]}
                                            value={settings.display.position}
                                            onChange={handlePositionChange}
                                        />
                                        <Checkbox
                                            label="Allow popup to be closed"
                                            checked={settings.display.allowClose}
                                            onChange={handleAllowCloseChange}
                                            helpText="When enabled, shows a close button in the top-right corner"
                                        />
                                        <RangeSlider
                                            label="Maximum Width"
                                            value={parseInt(settings.display.maxWidth)}
                                            min={100}
                                            max={1000}
                                            step={100}
                                            output
                                            suffix="px"
                                            onChange={handleMaxWidthChange}
                                        />
                                        <Checkbox
                                            label="Show Product Image"
                                            checked={settings.display.showImage}
                                            onChange={handleShowImageChange}
                                        />
                                        <Select
                                            label="Image Shape"
                                            options={[
                                                {label: 'Square', value: 'square'},
                                                {label: 'Rounded', value: 'rounded'}
                                            ]}
                                            value={settings.display.imageShape}
                                            onChange={handleImageShapeChange}
                                            disabled={!settings.display.showImage}
                                        />
                                        <RangeSlider
                                            label="Image Size"
                                            value={parseInt(settings.display.imageSize)}
                                            min={50}
                                            max={150}
                                            step={10}
                                            output
                                            suffix="px"
                                            onChange={handleImageSizeChange}
                                            disabled={!settings.display.showImage}
                                        />
                                        <Select
                                            label="Popup Shape"
                                            options={[
                                                {label: 'Square', value: 'square'},
                                                {label: 'Rounded', value: 'rounded'}
                                            ]}
                                            value={settings.display.popupShape}
                                            onChange={handlePopupShapeChange}
                                        />
                                    </FormLayout>
                                </Box>
                            </Box>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <Box padding="4">
                                <Text variant="headingMd" as="h2">Timing Settings</Text>
                                <Box paddingBlockStart="4">
                                    <FormLayout>
                                        <RangeSlider
                                            label="Time between popups"
                                            value={settings.timing.interval / 1000}
                                            min={5}
                                            max={60}
                                            output
                                            suffix="seconds"
                                            onChange={handleIntervalChange}
                                        />
                                        <RangeSlider
                                            label="Popup display duration"
                                            value={settings.timing.displayDuration / 1000}
                                            min={3}
                                            max={15}
                                            output
                                            suffix="seconds"
                                            onChange={handleDurationChange}
                                        />
                                    </FormLayout>
                                </Box>
                            </Box>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <Box padding="4">
                                <Text variant="headingMd" as="h2">Style Settings</Text>
                                <Box paddingBlockStart="4">
                                    <FormLayout>
                                        <TextField
                                            label="Font Family"
                                            value={settings.style.fontFamily}
                                            onChange={handleFontFamilyChange}
                                        />
                                        <RangeSlider
                                            label="Font Size"
                                            value={parseInt(settings.style.fontSize)}
                                            min={10}
                                            max={20}
                                            step={1}
                                            output
                                            suffix="px"
                                            onChange={handleFontSizeChange}
                                        />
                                        <Grid>
                                            <Grid.Cell columnSpan={{xs: 6}}>
                                                <Text>Background Color</Text>
                                                <ColorPicker
                                                    color={settings.style.backgroundColor}
                                                    onChange={handleBackgroundColorChange}
                                                    allowAlpha
                                                />
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{xs: 6}}>
                                                <Text>Text Color</Text>
                                                <ColorPicker
                                                    color={settings.style.textColor}
                                                    onChange={handleTextColorChange}
                                                    allowAlpha
                                                />
                                            </Grid.Cell>
                                        </Grid>
                                    </FormLayout>
                                </Box>
                            </Box>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
            {toastActive && (
                <Toast
                    content={toastMessage}
                    error={toastError}
                    onDismiss={toggleToast}
                />
            )}
        </Frame>
    );
}

export default SettingsPage; 