from flask_testing import TestCase
from unittest.mock import patch, MagicMock
import json
import io

from app import app  

class TestLipSyncService(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        return app

    def test_no_files_uploaded(self):
        response = self.client.post('/lip-sync')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {'error': 'Missing image or audio file'})

    def test_empty_files_uploaded(self):
        data = {
            'image': (io.BytesIO(), ''),
            'audio': (io.BytesIO(), '')
        }
        response = self.client.post('/lip-sync', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {'error': 'No selected file'})

    @patch('os.getenv')
    @patch('requests.post')
    def test_successful_lip_sync(self, mock_post, mock_getenv):
        mock_getenv.return_value = 'mocked_api_key'
        mock_post.return_value.ok = True
        mock_post.return_value.json.return_value = {
            'output': {'output_video': 'http://example.com/video.mp4'}
        }
        
        image = io.BytesIO(b'fake image data')
        image.name = 'test.jpg'
        audio = io.BytesIO(b'fake audio data')
        audio.name = 'test.mp3'
        
        files = {
            'image': (image, 'test.jpg'),
            'audio': (audio, 'test.mp3')
        }
        
        response = self.client.post('/lip-sync', content_type='multipart/form-data', data=files)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'output_video_url': 'http://example.com/video.mp4'})

    @patch('os.getenv')
    @patch('requests.post')
    def test_api_failure(self, mock_post, mock_getenv):
        mock_getenv.return_value = 'mocked_api_key'
        mock_post.return_value.ok = False
        mock_post.return_value.status_code = 500
        mock_post.return_value.text = 'Server Error'
        
        image = io.BytesIO(b'valid image data')
        image.name = 'test.jpg'
        audio = io.BytesIO(b'valid audio data')
        audio.name = 'test.mp3'
        
        files = {
            'image': (image, 'test.jpg'),
            'audio': (audio, 'test.mp3')
        }
        
        response = self.client.post('/lip-sync', content_type='multipart/form-data', data=files)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {
            'error': 'Failed to process with Gooey AI',
            'details': 'Server Error'
        })

    @patch('py_eureka_client.eureka_client.init')
    def test_eureka_init(self, mock_init):
        mock_init.return_value = None
        self.assertFalse(mock_init.called)

if __name__ == '__main__':
    import unittest
    unittest.main()
