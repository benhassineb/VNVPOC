using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using Tesseract;
using System.Diagnostics;
using ImageFormat = System.Drawing.Imaging.ImageFormat;

namespace VnV_Poc.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }



        [HttpPut]
        [Route("AnalyseFile")]
        public async Task<IActionResult> AnalyseFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");
            RecogniseImageResult ocrResult;

            var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploaded", file.FileName);

            using (MemoryStream ms = new MemoryStream())
            {
                using (Image tiff = Image.FromStream(file.OpenReadStream()))
                {
                    tiff.Save(ms, ImageFormat.Tiff);
                    byte[] Bytes = ms.ToArray();
                    Debug.WriteLine("1--" + DateTime.Now.Millisecond);
                    ocrResult = await GetTextFromImage(Bytes);

                    Debug.WriteLine("2--" + DateTime.Now.Millisecond);

                    Task.Run(() => SaveFile(path, Bytes));
                }
            }
            Debug.WriteLine("3--" + DateTime.Now.Millisecond);

            return Ok(ocrResult);
        }

        private async Task SaveFile(string path, byte[] bytes)
        {
            Debug.WriteLine("SaveFile--1--" + DateTime.Now.Millisecond);

            using (var fs = new FileStream(path, FileMode.Create))
            {
                await fs.WriteAsync(bytes, 0, (int)bytes.Length);
            }
            Debug.WriteLine("SaveFile--2--" + DateTime.Now.Millisecond);

        }

        private async Task<RecogniseImageResult> GetTextFromImage(byte[] tiff)
        {

            Debug.WriteLine("getTextFromImage--1--" + DateTime.Now.Millisecond);

            RecogniseImageResult result;
            using (var engine = new TesseractEngine(@"./tessdata", "fra", EngineMode.Default))
            {
                using (var img = Pix.LoadTiffFromMemory(tiff))
                {
                    using (var page = engine.Process(img))
                    {
                        string text = page.GetText();
                        string hocrtext = page.GetHOCRText(0);
                        result = new RecogniseImageResult() { Text = text, Html = hocrtext };
                    }
                }
            }
            Debug.WriteLine("getTextFromImage--2--" + DateTime.Now.Millisecond);

            return result;
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
