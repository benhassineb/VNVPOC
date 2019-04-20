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

            using (var stream = file.OpenReadStream())
            {
                MemoryStream ms = new MemoryStream();
                stream.CopyTo(ms);
                ocrResult = await getTextFromImage(ms.ToArray());
            }

            //using (MemoryStream ms = new MemoryStream())
            //{
            //    Image tiff = Image.FromStream(file.OpenReadStream());
            //    tiff.Save(ms, ImageFormat.Tiff);

            //    ocrResult = getTextFromImage(ms.ToArray());
            //    //Task<string> task = Task.Run(() => getTextFromImage(ms.ToArray()));
            //    //ocrResult = await task;
            //}
            return Ok(ocrResult);
        }



        private async Task<RecogniseImageResult> getTextFromImage(byte[] tiff)
        {
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
