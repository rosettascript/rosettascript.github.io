[y, fs] = audioread('C:\Users\Kim\Documents\Audacity\Activity_DSP.wav');  % Load the audio file

% Visualize the original frequency spectrum
Y = fft(y);
N = length(Y);
f = (0:N-1)*(fs/N);
magnitude = abs(Y);

figure;
plot(f, magnitude);
xlabel('Frequency (Hz)');
ylabel('Magnitude');
title('Original Frequency Spectrum');

% Band-pass filter design (assuming voice is between )
fc1 = 900;
fc2 = 1500;
order = 100;

b = fir1(order, [fc1 fc2]/(fs/2), 'bandpass');
freqz(b, 1, 1024, fs);  % Visualize the filter response

% Apply the band-pass filter
filtered_y = filter(b, 1, y);

% Save the filtered audio
audiowrite('filtered_voice.wav', filtered_y, fs);

% Plot the frequency spectrum of the filtered signal
Y_filtered = fft(filtered_y);
magnitude_filtered = abs(Y_filtered);

figure;
plot(f, magnitude_filtered);
xlabel('Frequency (Hz)');
ylabel('Magnitude');
title('Filtered Frequency Spectrum');
